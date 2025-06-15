
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoomCard } from '@/components/ui/RoomCard';
import { PromotionCard } from '@/components/ui/PromotionCard';
import { useAuth } from '@/contexts/AuthContext';
import { mockRooms } from '@/data/accommodationsData';
import { mockPromotions } from '@/models/promotion';

interface Favorite {
  itemId: string;
  itemType: 'accommodation' | 'promotion';
  addedAt: string;
}

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    if (user) {
      const userFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      setFavorites(userFavorites);
    }
  }, [user]);

  // Filter favorite accommodations and promotions
  const favoriteAccommodations = mockRooms.filter(room => 
    favorites.some(fav => fav.itemId === room.id && fav.itemType === 'accommodation')
  );

  const favoritePromotions = mockPromotions.filter(promotion => 
    favorites.some(fav => fav.itemId === promotion.id && fav.itemType === 'promotion')
  );

  const totalFavorites = favorites.length;

  // Listen to localStorage changes to update favorites in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      if (user) {
        const userFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
        setFavorites(userFavorites);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen to custom events for same-page updates
    const handleFavoritesUpdate = () => {
      if (user) {
        const userFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
        setFavorites(userFavorites);
      }
    };

    // Refresh favorites every 2 seconds to catch any updates
    const interval = setInterval(handleFavoritesUpdate, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Meus Favoritos</CardTitle>
          <CardDescription>
            Acomodações e promoções que você salvou ({totalFavorites} itens)
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="accommodations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accommodations">
            Acomodações ({favoriteAccommodations.length})
          </TabsTrigger>
          <TabsTrigger value="promotions">
            Promoções ({favoritePromotions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accommodations" className="mt-6">
          {favoriteAccommodations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteAccommodations.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma acomodação favorita
                </p>
                <p className="text-gray-600 text-center">
                  Explore nossas acomodações e salve suas favoritas clicando no ❤️
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="promotions" className="mt-6">
          {favoritePromotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePromotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma promoção favorita
                </p>
                <p className="text-gray-600 text-center">
                  Confira nossas promoções especiais e salve suas favoritas clicando no ❤️
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Favorites;
