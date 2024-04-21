<template>
  <div class="WelcomeToFinWise">
    <div id="Welcome">
      <h1>Welcome to FinWise!</h1>
    </div>
  </div>
</template>

<script>
console.log("in WelcomeComponent")
export default {

}
</script>

<style scoped>

.WelcomeToFinWise {
  place-items: center;
  min-height: 1000px;
  display: grid;
  position: relative;
  background-image: url('@/assets/Homebackground.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.WelcomeToFinWise > * {
  grid-area: auto;
  animation: parallax linear;
  animation-timeline: scroll();
}

#Welcome {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  --parallax-speed: -20;
  z-index: 2;
  font-size: 60px;
  color: #740CCC;
  text-shadow: 6px 6px rgb(255, 255, 255);
  align-content: center;
}

@keyframes parallax {
  to {
    transform: translateY(calc(var(--parallax-speed) * 100px));
  }
}

</style>
