import { inject, Injectable } from '@angular/core';
import { FlashCard } from '../models/flashcard-dto';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
   private http = inject(HttpClient);
  private API = 'http://localhost:8000/api/cards';

  async getCards(): Promise<FlashCard[]> {
    return firstValueFrom(this.http.get<FlashCard[]>(this.API));
  }

  async addCard(card: Omit<FlashCard, 'id'>): Promise<FlashCard> {
    return firstValueFrom(this.http.post<FlashCard>(this.API, card));
  }

 
 async deleteCard(id: number): Promise<void> {
  const response = await fetch(`${this.API}/${id}`, { 
    method: 'DELETE' 
  });
  
  if (!response.ok) {
    throw new Error(`Error al borrar: ${response.status}`);
  }
}

  async updateCard(id: number, card: Omit<FlashCard, 'id'>): Promise<FlashCard> {
    const res = await fetch(`${this.API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    });
    if (!res.ok) throw new Error('Error al editar');
    return res.json();
  }
}