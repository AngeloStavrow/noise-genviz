/* globals Tone, Pts */
const space = new Pts.CanvasSpace('#visualization');
space.setup({ bgcolor: '#123' });
const form = space.getForm();
const colors = ['#0f03', '#0f04', '#0f05'];

const noise = new Tone.Noise();
const sound = Pts.Sound.from(noise, noise.context).analyze(256);
noise.toMaster();

(function() {
  space.add({
    animate: (time, ftime) => {
      let fd = sound.freqDomainTo( [space.size.y, space.size.x/2] );
      let h = space.size.y / fd.length;

      for (let i=0, len=fd.length; i<len; i++) {
        let f = fd[i];
        let hz = Math.floor( i*sound.sampleRate / (sound.binSize*2) ); // bin size is fftSize/2
        let color = colors[i%3];

        // draw spikes
        form.fillOnly(color).polygon([[space.center.x, f.x], [space.center.x, f.x+h], [-f.y+space.center.x, f.x+h/2]]);
        form.fillOnly(color).polygon([[space.center.x, f.x], [space.center.x, f.x+h], [f.y+space.center.x, f.x+h/2]]);
        
        // draw circle
        form.fillOnly(color).point([space.center.x-f.y, f.x+h/2], h/2 + 2 * f.y/space.size.x, "circle");
        form.fillOnly(color).point([space.center.x+f.y, f.x+h/2], h/2 + 2 * f.y/space.size.x, "circle");
      }
    }
  });

  space.play();
})();



let currentlyPlaying = {
    whiteNoiseButton: false,
    pinkNoiseButton: false,
    brownNoiseButton: false
  };

const whiteNoiseButton = document.getElementById('whiteNoiseButton');
whiteNoiseButton.addEventListener('click', togglePlaybackState);
const pinkNoiseButton = document.getElementById('pinkNoiseButton');
pinkNoiseButton.addEventListener('click', togglePlaybackState);
const brownNoiseButton = document.getElementById('brownNoiseButton');
brownNoiseButton.addEventListener('click', togglePlaybackState);

function togglePlaybackState(event) {
  if (currentlyPlaying[event.target.id]) {
    event.target.innerText = '▶️';
    stopPlaying(event.target.id);
  }
  else {
    event.target.innerText = '⏸';
    switch (event.target.id) {
      case 'whiteNoiseButton':
        noise.type = 'white';
        pinkNoiseButton.innerText = '▶️'
        brownNoiseButton.innerText = '▶️'
        break;
      case 'pinkNoiseButton':
        noise.type = 'pink';
        whiteNoiseButton.innerText = '▶️'
        brownNoiseButton.innerText = '▶️'
        break;
      case 'brownNoiseButton':
        noise.type = 'brown';
        whiteNoiseButton.innerText = '▶️'
        pinkNoiseButton.innerText = '▶️'
        break;
    }
    startPlaying(event.target.id);
  }
}

function startPlaying(targetGeneratorID) {
  if (currentlyPlaying[targetGeneratorID]) {
    return;
  }

  Object.keys(currentlyPlaying).filter(id => id != targetGeneratorID).forEach(id => stopPlaying(id));
  
  noise.start();
  currentlyPlaying[targetGeneratorID] = !currentlyPlaying[targetGeneratorID];
}

function stopPlaying(targetGeneratorID) {
  noise.stop();
  
  if (!currentlyPlaying[targetGeneratorID]) {
    return;
  }
  
  currentlyPlaying[targetGeneratorID] = !currentlyPlaying[targetGeneratorID];
}


