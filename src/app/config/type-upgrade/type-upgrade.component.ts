import { UpgradeDialogComponent } from './upgrade-dialog/upgrade-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatTableDataSource } from '@angular/material';
import { TypeUpgrade, Type } from 'src/app/models/type';
import { TypeService } from 'src/app/services/type.service';

@Component({
  selector: 'app-type-upgrade',
  templateUrl: './type-upgrade.component.html',
  styleUrls: ['./type-upgrade.component.css']
})
export class TypeUpgradeComponent implements OnInit {
  service: TypeService;
  snackBar: MatSnackBar;
  typeUpgrades: TypeUpgrade[] = [];
  types: Type[] = [];
  dataSource: MatTableDataSource<TypeUpgrade> = new MatTableDataSource();

  constructor(
    private _service: TypeService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.service = _service;
    this.snackBar = _snackBar;
  }

  eventDialogRef: MatDialogRef<UpgradeDialogComponent>;

  ngOnInit() {
    this.loadType();
    this.loadTypeUpgrades();
  }

  loadType() {
    this.service.getTypes().then(data => this.types = data);
  }

  loadTypeUpgrades() {
    this.service.getTypeUpgrades().then(data => {
      this.typeUpgrades = data;
      this.dataSource.data = this.typeUpgrades;
    }).catch(res => {
      this.dataSource.data = this.typeUpgrades;
    });
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      types: this.types,
      upgrade: new TypeUpgrade()
    };

    this.eventDialogRef = this.dialog.open(UpgradeDialogComponent, dialogConfig);

    this.eventDialogRef.afterClosed().subscribe(data => {
      if (data) {
        let upgrade: TypeUpgrade = data as TypeUpgrade;

        this.service.addTypeUpgrade(upgrade).then(id => {
          upgrade.id = id;
          this.typeUpgrades.push(upgrade);
          this.dataSource.data = this.typeUpgrades;
          this.snackBar.open(`Added`, "", {
            duration: 3000
          });
        });
      }
    });
  }

  edit(upgrade: TypeUpgrade) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      types: this.types,
      upgrade: upgrade
    };

    this.eventDialogRef = this.dialog.open(UpgradeDialogComponent, dialogConfig);

    this.eventDialogRef.afterClosed().subscribe(data => {
      if (data) {
        let iUpgrade: TypeUpgrade = data as TypeUpgrade;
        this.service.updateTypeUpgrade(iUpgrade);
        upgrade = iUpgrade;
        this.snackBar.open(`Updated`, "", {
          duration: 3000
        });
      }
    });
  }

  changeStatus(upgrade: TypeUpgrade) {
    this.service.updateTypeUpgradeActive(upgrade);
    this.snackBar.open(`Status ${upgrade.active ? 'Active' : 'Inactive'}`, "", {
      duration: 3000
    });
  }
}
