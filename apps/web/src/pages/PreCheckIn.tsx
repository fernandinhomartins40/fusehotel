import { FormEvent, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePublicPreCheckIn, useSubmitPublicPreCheckIn } from '@/hooks/useCRM';

export default function PreCheckIn() {
  const { token = '' } = useParams();
  const { data, isLoading } = usePublicPreCheckIn(token);
  const submitMutation = useSubmitPublicPreCheckIn();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    documento: '',
    endereco: '',
    observacoes: '',
    assinatura: '',
  });

  const reservation = data?.reservation;
  const alreadySubmitted = data?.status === 'SUBMITTED' || data?.status === 'APPROVED' || data?.status === 'CHECKED_IN';
  const title = useMemo(() => {
    if (!reservation) {
      return 'Pré-check-in';
    }

    return `Pré-check-in da reserva ${reservation.reservationCode}`;
  }, [reservation]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMutation.mutate({
      token,
      payload: {
        guestData: form,
        signatureData: form.assinatura,
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {reservation
                ? `${reservation.guestName} • ${reservation.accommodation?.name ?? 'Hospedagem'}`
                : 'Informe seus dados para agilizar a chegada no hotel.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            {reservation && (
              <div className="grid gap-2 md:grid-cols-3">
                <div><strong>Check-in:</strong> {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')}</div>
                <div><strong>Check-out:</strong> {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}</div>
                <div><strong>Status FNRH:</strong> {data?.fnrhStatus}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados do hóspede</CardTitle>
            <CardDescription>
              {alreadySubmitted ? 'Pré-check-in já enviado. Você pode conferir os dados abaixo.' : 'Preencha todos os campos obrigatórios.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" value={form.nome} onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} disabled={alreadySubmitted} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} disabled={alreadySubmitted} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" value={form.telefone} onChange={(event) => setForm((current) => ({ ...current, telefone: event.target.value }))} disabled={alreadySubmitted} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" value={form.cpf} onChange={(event) => setForm((current) => ({ ...current, cpf: event.target.value }))} disabled={alreadySubmitted} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="documento">Documento adicional</Label>
                  <Input id="documento" value={form.documento} onChange={(event) => setForm((current) => ({ ...current, documento: event.target.value }))} disabled={alreadySubmitted} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Textarea id="endereco" value={form.endereco} onChange={(event) => setForm((current) => ({ ...current, endereco: event.target.value }))} disabled={alreadySubmitted} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea id="observacoes" value={form.observacoes} onChange={(event) => setForm((current) => ({ ...current, observacoes: event.target.value }))} disabled={alreadySubmitted} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="assinatura">Assinatura eletrônica</Label>
                  <Input id="assinatura" value={form.assinatura} onChange={(event) => setForm((current) => ({ ...current, assinatura: event.target.value }))} disabled={alreadySubmitted} required />
                </div>
              </div>

              <Button type="submit" disabled={alreadySubmitted || submitMutation.isPending}>
                {submitMutation.isPending ? 'Enviando...' : alreadySubmitted ? 'Pré-check-in enviado' : 'Enviar pré-check-in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
