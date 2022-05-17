function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelectorAll(".close");//creation variable qui va permettre de fermer la modale
const submitForm = document.getElementById("form");//on récupère le formulaire
const formContainer = document.getElementById("form-container");//on récupère le container du formulaire

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
closeBtn.forEach((btn) => btn.addEventListener("click", closeModal));//permet de passer l'ecouteur d'évènement sur l'élément courant
submitForm.addEventListener("submit", validateForm);//ajout un écouteur d'évènement de type submit sur le formulaire


// launch modal form permet d'afficher la modale 
function launchModal() {
  modalbg.style.display = "block";
  submitForm.reset();
}
function closeModal() {
  // supprime le message de validation
  // --> ajoute un id a l'element contenant le message
  // --> il faut veiller a ce que l'element existe
  //     -> recupere l'element avec get...
  //       si n'existe pas rien faire
  //       si existe le supprimer de form-container
  modalbg.style.display = "none";//faitdisparaître la modale
  const closeModalMessage = document.getElementById("message-container");
  if (closeModalMessage !== null) {               //on fait en sorte que le message de validation ne se réaffiche pas lorsqu'on utilise l'élément "close" pour fermer la modale puis qu'on l'ouvre de nouveau pour s'inscrire
    formContainer.removeChild(closeModalMessage)
  }
  document.querySelectorAll('.formData').forEach(//on supprime les messages d'erreur qui s'affichent si le formulaire a été fermer alors qu'il n'était pas valid
    (el) => el.setAttribute('data-error-visible', false)
  )
  submitForm.style.display = "block";
  formContainer.classList.remove('form__container');

}

//fonction qui permet d'afficher  le message d'erreur après invalidation d' un champs
//on affiche le message d'erreur au dessous des inputs en utilisant les propriétés du css de .formdata, class elt parent
function displayError(element, errorMessage) {
  element.parentNode.setAttribute("data-error", errorMessage) 
  element.parentNode.setAttribute("data-error-visible", true)
}

//fonction qui permet de ne rien afficher champs valide
function hideError(element) {
  element.parentNode.setAttribute("data-error-visible", false)
}

//valide les différents champs du formulaire
function validateForm(event) {
  let isFormValid = true //formulaire valide état initial supposé valide jusqu'à erreur
  event.preventDefault()                      //empêche le comportement par défault de l'évènement submit qui envoie les données au serveur, validation côté clients
  const firstName = event.target.first;       //le formulaire contient tous les champs de ses éléments html, on utilise donc l'attribut name des inputs pour cibler les champs  
  const lastName = event.target.last;
  const emailField = event.target.email;
  const dateOfBirth = event.target.birthdate;
  const numberOfParticipation = event.target.quantity;
  const location = event.target.location;
  const firstCheckbox = event.target.condition;
  const secondCheckbox = event.target.newsletter;
  if (firstName.value.length < 3) {                     //erreur:prénom contenant strictement moins de 3 lettres
    displayError(firstName, "Le prénom doit contenir plus de deux lettres")//le champs est invalide, le message d'erreur à afficher
     isFormValid = false                                                   //le formulaire est invalide
  } else {
    hideError(firstName)                                                    //on affiche rien qd le champs est valid
  }

  if (lastName.value.length < 3) {                      //idem
    displayError(lastName, "Le nom doit contenir plus de deux lettres")
     isFormValid = false
  } else {
    hideError(lastName)
  }

  const emailReg = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g); //utilisation d'une expression régulière pour vérifier la validité de l'email
  if (emailReg.test(emailField.value) === false) {
    displayError(emailField, "Adresse email invalide")
     isFormValid = false
  } else {
    hideError(emailField)
  }

  // utilise l'objet Date pour creer une instance de type Date avec la valeur du formulaire, assignee a une variable
  // utilise la methode getFullYear de la variable pour recuperer l'annee
  // erreur si annee plus petite que 1902 ou plus grande que 2006, alors afficher erreur ou si le champs est vide ou si la valeur n'est pas définie
  const date = new Date(dateOfBirth.value)
  if (date.getFullYear() < 1902 || date.getFullYear() > 2006 || dateOfBirth.value === "" || dateOfBirth.value === undefined) {
    displayError(dateOfBirth, "Date de naissance invalide")
     isFormValid = false
  } else {
    hideError(dateOfBirth)
  }
  //utilise le constructeur Number pour définir le type de numberOfParticipation.value comme un nombre
  //erreur: valeur<0 ou vide ou non définie

  if (Number(numberOfParticipation.value) < 0 || numberOfParticipation.value === "" || numberOfParticipation.value === undefined) {
    displayError(numberOfParticipation, "Veuillez saisir une quantité")
     isFormValid = false
  } else {
    hideError(numberOfParticipation)
  }

  //
  const check = document.getElementsByName("location")
  const isOneChecked = Array.from(check).some((itemLocation) => itemLocation.checked === true)
  if (isOneChecked === false) {
    displayError(check[0], "Selectionez un lieu de votre choix")
    isFormValid = false
  } else{
    hideError(check[0])
  }
  
  if (firstCheckbox.checked === false){
    displayError(firstCheckbox, "vous devez acceptez les conditions d'utilisation")
    isFormValid = false
  } else{
    hideError(firstCheckbox)
  }

  //si le formulaire est valide, on affiche le message de validation et le bouton pour le fermer 
  if(isFormValid){
    const messageContainer = document.createElement("div"); //on crée l 'élément qui va contenir le message de validation d'inscription
    messageContainer.setAttribute("id", "message-container")//on lui attribue un id
    messageContainer.innerHTML = "<div>Merci pour<br> votre inscription</div><button id='close-btn' class='btn-submit btn-signup'>Fermer</button>";//cette propriété définie la syntaxe html dse descendants de l' élt ici le message de validation et le bouton"fermer"
    formContainer.appendChild(messageContainer);//on ajoute l'élement enfant à son élément parent(modal body)
    submitForm.style.display = "none";//le formulaire doit disparaître de la modale, on le cache
    formContainer.classList.add("form__container");//On ajoute une classe à l'élément
    const button = document.getElementById("close-btn");//on récupère l 'objet button grâce à son id
    function closeSubmit(){ //on implémente la fonction qui va permettre de fermer le message de validation
      formContainer.removeChild(messageContainer); //on supprime l'élément qui contient le message
      submitForm.style.display = "block"; //on permet au formulaire de s'afficher à nouveau
      closeModal()
      formContainer.classList.remove("form__container")
      submitForm.reset()                                      //réinitialisation du formulaire
    }

    button.addEventListener("click", closeSubmit)        //on ajoute un écouteur d'évènement au click sur le bouton qui va cacher la modale
    
  
  
  
   
  }
 
}






