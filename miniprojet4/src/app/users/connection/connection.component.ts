import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../Model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string = '';
  loading = false;
  returnUrl: string = '/home';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Récupérer l'URL de retour des query params ou utiliser la valeur par défaut
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        // Rediriger vers l'URL de retour après connexion réussie
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        console.error('Erreur de connexion:', error);
        if (error.status === 403) {
          this.errorMessage = 'Accès refusé - Vérifiez vos identifiants';
        } else if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur - Vérifiez votre connexion';
        } else {
          this.errorMessage = error.message || 'Une erreur est survenue lors de la connexion';
        }
      }
    });
  }
}
