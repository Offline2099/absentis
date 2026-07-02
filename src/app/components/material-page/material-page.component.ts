import { Component, Signal } from '@angular/core';
import { Material } from '../../types/material/material.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-material-page',
  imports: [RouterLink],
  templateUrl: './material-page.component.html',
  styleUrl: './material-page.component.scss',
})
export class MaterialPageComponent {

  material: Signal<Material | null>;

  constructor(private route: ActivatedRoute) {
    this.material = toSignal(this.route.data.pipe(map(data => data['material'])));
  }

}
