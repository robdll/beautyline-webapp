/**
 * Stato del form profilo utente (pagina `/account`).
 */
export interface ProfileForm {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    streetNumber: string;
    postalCode: string;
    city: string;
    province: string;
  };
}
