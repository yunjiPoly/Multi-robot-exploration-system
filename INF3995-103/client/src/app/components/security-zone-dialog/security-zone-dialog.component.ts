import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Position } from 'src/app/classes/position';
import { FormGroup, FormControl, ValidationErrors, ValidatorFn, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { SecurityZoneService } from 'src/app/services/security-zone.service';
import { Dim } from 'src/app/classes/dim';

const MIN_ZONE_AREA = 4;
const MAX_ABS_ZONE_COORDINATE = 5;

@Component({
  selector: 'app-security-zone-dialog',
  templateUrl: './security-zone-dialog.component.html',
  styleUrls: ['./security-zone-dialog.component.scss']
})
export class SecurityZoneDialogComponent implements OnInit, OnDestroy {
  formParameters: FormGroup;
  isZoneValid: boolean;
  private componentDestroyed$: Subject<boolean>;

  constructor(
    private dialogRef: MatDialogRef<SecurityZoneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly securityZoneService: SecurityZoneService,
    private formBuilder: FormBuilder
  ) {
    this.componentDestroyed$ = new Subject();
    this.isZoneValid = false;
  }

  ngOnInit(): void {
    this.formParameters = this.formBuilder.group(
      {
        originX: new FormControl(0, [Validators.required, Validators.min(-MAX_ABS_ZONE_COORDINATE), Validators.max(MAX_ABS_ZONE_COORDINATE)]),
        originY: new FormControl(0, [Validators.required, Validators.min(-MAX_ABS_ZONE_COORDINATE), Validators.max(MAX_ABS_ZONE_COORDINATE)]),
        height: new FormControl(2, [Validators.required, Validators.min(1), Validators.max(2 * MAX_ABS_ZONE_COORDINATE)]),
        width: new FormControl(2, [Validators.required, Validators.min(1), Validators.max(2 * MAX_ABS_ZONE_COORDINATE)])
      },
      {
        validators: [this.zoneAreaOver4()],
        updateOn: 'change'
      }
    );
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  createSecurityZone(): void {
    const origin: Position = {
      x: this.formParameters.get('originX')?.value,
      y: this.formParameters.get('originY')?.value
    };
    const dimensions: Dim = {
      width: this.formParameters.get('width')?.value,
      height: this.formParameters.get('height')?.value
    };
    this.securityZoneService.createSecurityZone(origin, dimensions);
    this.closeDialog();
  }

  zoneAreaOver4(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const x = Math.abs(formGroup.get('originX')?.value);
      const y = Math.abs(formGroup.get('originY')?.value);
      const width = formGroup.get('width')?.value;
      const height = formGroup.get('height')?.value;

      const widthInsideZone = width / 2 + Math.min(MAX_ABS_ZONE_COORDINATE - x, width / 2);
      const heightInsideZone = height / 2 + Math.min(MAX_ABS_ZONE_COORDINATE - y, height / 2);
      const areaInside = widthInsideZone * heightInsideZone;

      if (areaInside >= MIN_ZONE_AREA) {
        return null;
      } else {
        return { areaTooSmall: true };
      }
    };
  }
}
