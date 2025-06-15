
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'accommodation' | 'promotion';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  itemType,
  className,
  size = 'md'
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    if (user) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      const favorite = favorites.find((f: any) => f.itemId === itemId && f.itemType === itemType);
      setIsFavorite(!!favorite);
    }
  }, [user, itemId, itemType]);

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar favoritos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      
      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter((f: any) => 
          !(f.itemId === itemId && f.itemType === itemType)
        );
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
          description: "Item removido da sua lista de favoritos",
        });
      } else {
        // Add to favorites
        const newFavorite = {
          itemId,
          itemType,
          addedAt: new Date().toISOString(),
        };
        const updatedFavorites = [...favorites, newFavorite];
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
        setIsFavorite(true);
        toast({
          title: "Adicionado aos favoritos",
          description: "Item salvo na sua lista de favoritos",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        sizeClasses[size],
        'rounded-full border-2 transition-all duration-200',
        isFavorite 
          ? 'bg-red-50 border-red-300 hover:bg-red-100 text-red-600' 
          : 'bg-white/90 border-gray-300 hover:bg-gray-50 text-gray-600',
        isLoading && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={toggleFavorite}
      disabled={isLoading}
    >
      <Heart 
        size={iconSizes[size]} 
        className={cn(
          'transition-all duration-200',
          isFavorite ? 'fill-current' : ''
        )}
      />
    </Button>
  );
};
