// NPM modules
var THREE = require('three');
var DAT = require('dat-gui');
var OrbitControls = require('three-orbit-controls')(THREE)

// App function
var App = function() {

	// Initial params
	var params = {
		particles: 3600,
		coef: 200,
		coef2: 20,
		color: '#fff',
		bgColor: '#000'
	};

	var gui = new DAT.GUI({ height: 5 * 32 - 1 });
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	var renderer = new THREE.WebGLRenderer({ alpha: true });
	var controls = new OrbitControls(camera, renderer.domElement);
	var texture = new THREE.ImageUtils.loadTexture('./dist/img/dot.gif');
	var material = new THREE.SpriteMaterial({
		color: new THREE.Color(params.color),
		map: texture
	});
	var particles = [];

	// Set GUI stuff
	gui.add(params, 'particles')
		.min(1)
		.max(3600)
		.step(100)
		.onChange(function() {
			for (var i = 0; i<particles.length;i++) scene.remove(particles[i]);
			particles = [];
			makeParticles(params.particles);
		});

	gui.add(params, 'coef')
		.min(-400)
		.max(400)
		.step(1);
	gui.add(params, 'coef2')
		.min(-400)
		.max(400)
		.step(1);

	gui.addColor(params, 'color')
		.onChange(function(colorValue) {
			material.color = new THREE.Color(colorValue);
		});

	gui.addColor(params, 'bgColor')
		.onChange(function(colorValue) {
			document.body.style.background = colorValue;
		});

	// Set the renderer and append it to the DOM
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	// Set camera position
	camera.position.z = 100;
	// And create the initial particles
	makeParticles(params.particles);

	// Update body background
	document.body.style.background = params.bgColor;

	// Render function
	(function render() {
		requestAnimationFrame( render );
		renderer.render( scene, camera );
		updateParticles();
	})();

	// Make some shiny particles
	function makeParticles(total) {

		var particle;
		start = time = Date.now();
		particles = [];

		for (var i = 0; i < total; i++) {
			particle = new THREE.Sprite(material);

			particle.position.x = particle.position.y = particle.position.z = 1;
			particle.angle = i/10;

			particle.position.x = i/params.coef * Math.cos(particle.angle);
			particle.position.y = i/params.coef * Math.sin(particle.angle);
			particle.position.z = i/params.coef * Math.tan(i/params.coef2);

			scene.add(particle);

			particles.push(particle);
		}
	}

	// Updates particles
	function updateParticles() {
		for (var i = 0; i < particles.length; i++) {
			particle = particles[i];

			// Update angle
			particle.angle = particle.angle < 360 ? particle.angle : 0;
			particle.angle += i/100000;

			particle.position.x = i/params.coef * Math.cos(particle.angle);
			particle.position.y = i/params.coef * Math.sin(particle.angle);
			particle.position.z = i/params.coef * Math.tan(i/params.coef2);
		}
	}

	// Get a random integer in the given interval
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

	// Update sizes
	function setSize() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}

	window.addEventListener('resize', setSize);
};

// Launch App on load
window.addEventListener('load', App);