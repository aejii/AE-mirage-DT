import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { of, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { InstallationQuery } from 'src/app/core/installation/installation.query';
import { InstallationService } from 'src/app/core/installation/installation.service';

@Component({
  selector: 'mg-installer',
  templateUrl: './installer.component.html',
  styleUrls: ['./installer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallerComponent implements OnInit {
  // Classes used for the assets
  classes = [
    'cra',
    'ecaflip',
    'eniripsa',
    'enutrof',
    'feca',
    'iop',
    'sacrieur',
    'sadida',
    'sram',
    'xelor',
  ];

  // Statuses to display under the loading bar
  statuses = [
    `Roulage de joint avec les boufcools ...`,
    `Réveil du tonton Sadida ...`,
    `Lustrage de la lampe de Kerubim ...`,
    `Contact à Nyom pour savoir si Mirage est légal ...`,
    `Analyse des mots de passe de ton téléphone ...`,
    `Recherche de tes nudes sur Snapchat ...`,
    `Prière au dieu Eniripsa pour soigner la verrue qu'est ta face ...`,
    `Vol de ton compte depuis le Maroc ...`,
    `Envoi d'une lettre d'insultes à Zanpoyo ...`,
    `Recherche de "Steamer Hentai" à la bibliothèque d'Amakna ...`,
    `Caressage des boules du Minotoboule de Nowel ...`,
    `🔥 💯 🔥 Mirage 👌 💯 🔥`,
    `Création de bots sur ton IP ...`,
    `Goumage de quelques full sasa ...`,
    `Trollage d'acheteurs offre en or ...`,
    `Mise à feu des champs d'Incarnam ...`,
    `"sudo rm -rf / --no-preserve-root" dans ton terminal ...`,
    `Suppression de toutes tes photos de famille ...`,
    `Récupération de tes données bancaires ...`,
    `Gobage de la RAM pour te faire lagger et rager ...`,
    `Vol de tes goultines ...`,
    `Vol de tes kamas ...`,
    `Vol de tes équipements ...`,
    `Suppression de tes persos ...`,
    `Minage de bitcoins sur ton processeur ...`,
    `Activation de ta webcam pour rire de comment t'es laid ...`,
    `Like & subscribe sur la châine d'Ecaramel pour financer ses achats de K ...`,
    `Envoi d'une demande de nudes à Mibato ...`,
  ];

  // Get a random god
  src$ = of(
    `url(assets/pictures/krosmaga/${
      this.classes[Math.floor(Math.random() * this.classes.length)]
    }.jpg)`,
  );

  // Randomizes the statuses and change the displayed one every N seconds. When all are done, restarts the randomize.
  currentStatus$ = timer(0, 4000).pipe(
    // Randomly sorts the statuses at each cycling
    map((i) => {
      const index = i % this.statuses.length;
      if (i === 0)
        this.statuses = this.statuses.sort(() => Math.random() * 2 - 1);
      return index;
    }),
  );

  // Current progress of the install
  progress$ = this.service.progress$.pipe(
    tap(() => setTimeout(() => this.cdRef.detectChanges())),
  );

  error$ = this.query.installError$.pipe(
    tap(() => setTimeout(() => this.cdRef.detectChanges())),
  );

  constructor(
    private service: InstallationService,
    private cdRef: ChangeDetectorRef,
    private query: InstallationQuery,
  ) {}

  ngOnInit(): void {}
}
