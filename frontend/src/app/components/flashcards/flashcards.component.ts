import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlashCard } from '../../models/flashcard-dto';
import { FlashcardService } from '../../services/flashcard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flashcards-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flashcards.component.html',
  styleUrl: './flashcards.component.css',
})
export class FlashcardsComponent implements OnInit {
  cards: FlashCard[] = [];
  flippedId: number | null = null;
  searchTerm: string = '';

  constructor(private service: FlashcardService) {}

  ngOnInit() {
    this.loadCards();
  }

  async loadCards() {
    this.cards = await this.service.getCards();
  }

  flip(id: number) {
    this.flippedId = this.flippedId === id ? null : id;
  }

  get filteredCards() {
    if (!this.searchTerm) return this.cards;
    const term = this.searchTerm.toLowerCase();
    return this.cards.filter(card => 
      card.word_en.toLocaleLowerCase().includes(term) ||
      card.word_es.toLocaleLowerCase().includes(term)
    );
  }

  async deleteCard(id: number) {
    if(confirm('¿Seguro que quieres borrar esta tarjeta?')) {
      await this.service.deleteCard(id);
      this.loadCards();
    }
  }
}
