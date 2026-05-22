import { Routes } from '@angular/router';
import { AddWordComponent } from './components/add-word/add-word.component';
import { FlashcardsComponent } from './components/flashcards/flashcards.component';

export const routes: Routes = [
  { path: '', redirectTo: '/add', pathMatch: 'full' },
  { path: 'add', component: AddWordComponent },
  { path: 'cards', component: FlashcardsComponent }
];