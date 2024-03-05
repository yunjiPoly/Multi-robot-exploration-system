import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Pose } from 'src/app/classes/position';
import { FormGroup, FormControl, ValidationErrors, ValidatorFn, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { MissionService } from 'src/app/services/mission.service';
import { Router } from '@angular/router';

const MIN_DISTANCE_FROM_ORIGIN = 0.5;
const MAX_ABS_POSITION_COORDINATE = 5;
const MAX_ABS_ORIENTATION = 180;

@Component({
  selector: 'app-positions-dialog',
  templateUrl: './positions-dialog.component.html',
  styleUrls: ['./positions-dialog.component.scss']
})
export class PositionsDialogComponent implements OnInit, OnDestroy {
  formParameters: FormGroup;
  private componentDestroyed$: Subject<boolean>;

  constructor(
    private dialogRef: MatDialogRef<PositionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private missionService: MissionService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.componentDestroyed$ = new Subject();
  }

  ngOnInit(): void {
    this.formParameters = this.formBuilder.group(
      {
        originX2: new FormControl(0, [
          Validators.required,
          Validators.min(-MAX_ABS_POSITION_COORDINATE),
          Validators.max(MAX_ABS_POSITION_COORDINATE)
        ]),
        originY2: new FormControl(1, [
          Validators.required,
          Validators.min(-MAX_ABS_POSITION_COORDINATE),
          Validators.max(MAX_ABS_POSITION_COORDINATE)
        ]),
        orientation2: new FormControl(0, [Validators.required, Validators.min(-MAX_ABS_ORIENTATION), Validators.max(MAX_ABS_ORIENTATION)])
      },
      {
        validators: [this.positiveDistance()],
        updateOn: 'change'
      }
    );
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  closeDialog(startingMission: boolean = false): void {
    this.dialogRef.close(startingMission);
  }

  setInitialPositions(): void {
    const initialPositions: Pose[] = [
      {
        x: this.formParameters.get('originX2')?.value,
        y: this.formParameters.get('originY2')?.value,
        orientation: this.formParameters.get('orientation2')?.value
      }
    ];

    this.missionService.initialPositions = initialPositions;
    this.closeDialog(true);
  }

  positiveDistance(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const x = Math.abs(formGroup.get('originX2')?.value);
      const y = Math.abs(formGroup.get('originY2')?.value);

      const distanceFromOrigin = Math.sqrt(x ** 2 + y ** 2);

      if (distanceFromOrigin >= MIN_DISTANCE_FROM_ORIGIN) {
        return null;
      } else {
        return { distanceTooSmall: true };
      }
    };
  }
}
