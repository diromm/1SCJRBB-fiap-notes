import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Note } from './@types/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl: string;

  private newNoteSource = new Subject<Note>();
  newNoteProvider = this.newNoteSource.asObservable();

  private putNoteSource = new Subject<Note>();
  putNoteProvider = this.putNoteSource.asObservable();  

  constructor(private http: HttpClient) {
    this.apiUrl = "https://fiap-notes-api.herokuapp.com";
  }


  notifyNewNoteAdded(note: Note){
    this.newNoteSource.next(note);
    // this.newNoteSource.error("algum exception");
  }

  notifyPutNoteClicked(note: Note) {
    this.putNoteSource.next(note);
  }  

  getNotes(){
    return this.http.get<Note[]>(`${this.apiUrl}/notes`);
  }

  removeNote(noteId: number){
    return this.http.delete(`${this.apiUrl}/notes/${noteId}`);
  }

  postNotes(textNote: string){
    return this.http.post<Note>(`${this.apiUrl}/notes`, {text: textNote});
  }

  putNote(note: Note) {
    return this.http.put<Note>(`${this.apiUrl}/notes/${note.id}`, {text: note.text});
  }
  
}
