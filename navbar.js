/** @format */

async function loadNavbar() {

  
  
  const response = await fetch("navbar.html");
  const navbar = await response.text();
  document.getElementById("navbar-container").innerHTML = navbar;
 


  


  // Add event listener for mobile menu button
  const btn = document.querySelector("button.mobile-menu-button");
  const menu = document.querySelector(".mobile-menu");
  const drp = document.getElementById("sinb");
  const drp1 = document.getElementById("sinm");

  const response1 = await fetch("profilepage.html");
  const navbar1 = await response1.text();
  document.getElementById("textDiv").innerHTML = navbar1;
  document.getElementById("textDiv1").innerHTML = navbar1;
  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
  // on mouse over
  drp.addEventListener("click", () => {
    window.location.href = "mprofilepage.html"
  });

  drp1.addEventListener("click", () => {
    document.getElementById("textDiv1").classList.remove("hidden");
    document.getElementById("textDiv1").classList.add("absolute");
  });
  //goto editprofile page
  // document.getElementById("editProfilebtn").addEventListener("click", () => {
  //   window.location.href = "editprofile.html";
  // });
  // on mouse out
  document.getElementById("textDiv").addEventListener("click", () => {
    // Redirect to edit profile page
    document.getElementById("textDiv").classList.add("hidden");
  });

  document.getElementById("closeit").addEventListener("click", () => {
    // Redirect to edit profile page
    document.getElementById("textDiv").classList.add("hidden");
    document.getElementById("textDiv1").classList.add("hidden");
  });

  document.getElementById("admin-panel").addEventListener("click", () => {
    window.location.href = "https://profstudymateadmin.com/";
  });
}

document.addEventListener("DOMContentLoaded", loadNavbar);


