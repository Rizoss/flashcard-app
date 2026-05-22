import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlashcardService } from '../../services/flashcard.service';
import { FlashCard } from '../../models/flashcard-dto';
@Component({
  selector: 'app-flashcard-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './flashcard-list.component.html',
  styleUrls: ['./flashcard-list.component.css']
})
export class FlashcardListComponent implements OnInit {
  cards: FlashCard[] = [];
  newCard = { word_en: '', word_es: '', sentence_en: '', sentence_es: '' };
  flippedId: number | null = null;

  constructor(private service: FlashcardService) {}

  async ngOnInit() {
    this.cards = await this.service.getCards();
  }

  async add() {
    if (!this.newCard.word_en || !this.newCard.word_es) return;
    const saved = await this.service.addCard(this.newCard);
    this.cards.unshift(saved);
    this.newCard = { word_en: '', word_es: '', sentence_en: '', sentence_es: '' };
  }

  flip(id: number) {
    this.flippedId = this.flippedId === id ? null : id;
  }
}