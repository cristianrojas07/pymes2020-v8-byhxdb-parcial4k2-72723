import { Component, OnInit } from '@angular/core';
import { MateriasService } from '../../services/materias.service';
import { Materias } from '../../models/materias';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css'],
  providers: [MateriasService]
})

export class MateriasComponent implements OnInit {
  Titulo = "Materias";
  TituloAccionABMC = {
    A: "(Agregar)",
    M: "(Modificar)",
    L: "(Listado)"
  };

  AccionABMC = "L";

  Mensajes = {
    RD: " Revisar los datos ingresados..."
  };

  submitted = false;

  Materias: Materias[] = [];

  formGroup: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private materiasService: MateriasService,
    private modalDialogService: ModalDialogService
  ){}
 
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      IdMateria: [0],
      MateriaAnio: ["", [Validators.required, Validators.pattern("[0-9]{1,4}")]],
      MateriaNombre: ["", [Validators.required, Validators.maxLength(55)]],
    });
    this.GetMaterias();
  }
 
  GetMaterias() {
    this.materiasService.get().subscribe((res: Materias[])=> {
      this.Materias = res;
    });
  }

  Agregar() {
    this.AccionABMC = "A";
    this.formGroup.reset();
    this.submitted = false;
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
  }

  BuscarPorId(Materia, AccionABMC) {
    window.scroll(0, 0); 
    this.materiasService.getById(Materia.IdMateria).subscribe((res: any) => {
      this.formGroup.patchValue(res);
      this.AccionABMC = AccionABMC;
    });
  }

  Modificar(Materia) {
    this.submitted = false;
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.BuscarPorId(Materia, "M");
  }
  
  Grabar() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const itemCopy = { ...this.formGroup.value };
    if (itemCopy.IdMateria == null){
      itemCopy.IdMateria = 0;
    }
    // agregar post
    if (itemCopy.IdMateria == 0) {
      this.materiasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.', 'Exito', 's');
        this.GetMaterias();
      });
    } else {
      // modificar put
      this.materiasService.put(itemCopy.IdMateria, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.GetMaterias();
        });
    }
  }

  Eliminar(Materia) {
    this.modalDialogService.Confirm(
      "Esta seguro de eliminar este registro?", undefined, undefined, undefined, () => this.materiasService.delete(Materia.IdMateria).subscribe((res: any) => {
        this.modalDialogService.Alert('Registro eliminado correctamente.', 'Exito', 's');
        this.GetMaterias();
      }), () => this.Volver(), 'd'
    );
  }

  Volver() {
    window.scroll(0, 0); 
    this.AccionABMC = "L";
  }
}