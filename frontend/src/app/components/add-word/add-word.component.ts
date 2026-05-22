import { Component } from '@angular/core';
import { FlashcardService } from '../../services/flashcard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-word-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-word.component.html',
  styleUrl: './add-word.component.css',
})
export class AddWordComponent {
newCard = { word_en: '', word_es: '', sentence_en: '', sentence_es: '' };

  constructor(private service: FlashcardService) {}

  async addCard() {
    if (!this.newCard.word_en || !this.newCard.word_es) return;
    await this.service.addCard(this.newCard);
    this.newCard = { word_en: '', word_es: '', sentence_en: '', sentence_es: '' };
    alert('Palabra añadida');
  }
}
