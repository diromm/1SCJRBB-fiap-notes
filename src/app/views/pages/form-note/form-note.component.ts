import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/services/@types/note';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-form-note',
  templateUrl: './form-note.component.html',
  styleUrls: ['./form-note.component.css'],
})
export class FormNoteComponent implements OnInit {
  title = 'FIAP NOTES';
  logoImage = '/assets/logo.png';

  checkoutForm: FormGroup;
  subscription: Subscription;

  noteToEdit = {} as Note;


  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ) {
    this.checkoutForm = this.formBuilder.group({
      textNote: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.subscription = this.noteService.putNoteProvider.subscribe({
      next: (note: Note) => {
       this.noteToEdit = note;
       this.checkoutForm.setValue({ textNote : note.text });
      },
      error: () => {}
    });
}

  ngOnInit(): void {}

  sendNote() {
    if (this.checkoutForm.valid) {    
      const isEditing = !!this.noteToEdit.id;
      if (isEditing) {
        this.putNote();
      } else {
        this.sendNewNote();
      }
    }
  }

  sendNewNote() {
    // console.log(this.checkoutForm.get('textNote')?.errors);
    if (this.checkoutForm.valid) {
      this.noteService.postNotes(this.checkoutForm.value.textNote).subscribe({
        //next é chamado quando as coisas dão certo
        next: (note) => {
          this.checkoutForm.reset();
          this.noteService.notifyNewNoteAdded(note);
        },
        //error é chamado no caso de excessões
        error: (error) => alert("Algo errado na inserção! " + error)
      });
    }
  }

  get textNote() {
    return this.checkoutForm.get('textNote');
  }

  putNote() { 
    this.noteToEdit.text = this.checkoutForm.value.textNote;    
    this.noteService.putNote(this.noteToEdit).subscribe({
      next: () => {
        this.checkoutForm.reset();
        this.noteToEdit = {} as Note;
      },
      //error é chamado no caso de excessões
      error: (error) => alert("Algo errado na alteração! " + error),
      // usando complete para aplicar conceitos aprendidos
      complete: () => alert("Nota alterada!")
    });
  }  
}
