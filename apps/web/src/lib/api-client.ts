import axios from 'axios';

// Em produção, usa URL relativa (mesmo domínio via Nginx)
// Em desenvolvimento, usa variável de ambiente ou localhost
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar cookies httpOnly
});

// Não precisamos mais adicionar o token no header, pois será enviado automaticamente via cookie
apiClient.interceptors.request.use((config) => {
  // Manter compatibilidade com tokens no localStorage (para casos antigos)
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag para rastrear se já estamos em processo de refresh
let isRefreshing = false;
let failedQueue: Array<{resolve: Function, reject: Function}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath === '/area-do-cliente' || currentPath === '/admin/login';

    // Lista de páginas públicas que não requerem autenticação
    const publicPages = [
      '/',
      '/acomodacoes',
      '/promocoes',
      '/sobre-nos',
      '/politicas-de-privacidade',
      '/faq',
      '/contato',
      '/servicos'
    ];
    const isPublicPage = publicPages.some(page =>
      currentPath === page || currentPath.startsWith(`${page}/`)
    );

    // Se estamos numa página pública ou de login e recebemos 401, não tente refresh
    if (error.response?.status === 401 && (isLoginPage || isPublicPage)) {
      // Não limpar localStorage em páginas públicas, apenas em páginas de login
      if (isLoginPage) {
        localStorage.clear();
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já estamos refreshing, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        }).then(() => {
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tentar refresh usando cookie httpOnly
        await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });

        processQueue(null, 'refreshed');
        isRefreshing = false;

        // Token foi renovado no cookie, apenas retentar a requisição
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Limpar qualquer dado antigo do localStorage
        localStorage.clear();

        // Só redirecionar se não estivermos em página de login ou página pública
        if (!isLoginPage && !isPublicPage) {
          window.location.href = '/area-do-cliente';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
