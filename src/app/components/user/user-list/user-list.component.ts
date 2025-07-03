import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuario.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    NgIf,
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    MatIconButton,
    MatButton
  ]
})
export class UserListComponent implements AfterViewInit {
  users: Usuario[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  dataSource = new MatTableDataSource<Usuario>();

  displayedColumns = ['id', 'username', 'nome', 'email', 'telefone', 'editar'];

  constructor(private userService: UserService, private router: Router) {
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      filter = filter.trim().toLowerCase();
      return (
        (data.username?.toLowerCase() || '').includes(filter) ||
        (data.nome?.toLowerCase() || '').includes(filter) ||
        (data.email?.toLowerCase() || '').includes(filter) ||
        (data.telefone?.toLowerCase() || '').includes(filter)
      );
    };
  }

  ngAfterViewInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.list().subscribe(users => {
      this.users = users;
      this.dataSource.data = users;

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter() {
    this.dataSource.filter = '';
  }

  onEditUser(user: Usuario) {
    this.router.navigate(['/register'], { queryParams: { userId: user.id } });
  }
}
