(function () {

  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define('pedal-chorus', class extends PBPlugin(HTMLElement) {

    // ----- METHODS: DEFAULT -----
    // is called when an instance of the element is created
    constructor() {
      // Toujours appeler "super" d'abord dans le constructeur
      super();

      // Ecrire la fonctionnalité de l'élément ici
      this.w = 140;
      this.h = 140;

      this.nbNodeIn = 1;
      this.nbNodeOut = 1;
    }

    get is() { return this.nodeName.toLowerCase(); }

    // observedAttributes : Specify observed attributes so that attributeChangedCallback will work
    static get observedAttributes() { return ['']; }

    // appelé lorsque l'un des attributs de l'élément personnalisé est ajouté, supprimé ou modifié.
    attributeChangedCallback() {
      console.log(`Custom element ${this.is} attributes changed.`);
    }

    // appelé lorsque l'élément personnalisé est déplacé vers un nouveau document
    adoptedCallback() {
      console.log(`Custom element ${this.is} moved to new page.`);
    }

    // appelé lorsque l'élément personnalisé est déconnecté du DOM du document 
    disconnectedCallback() {
      console.log(`Custom element ${this.is} removed from page.`);
    }

    // is called every time the element is inserted into the DOM. It is useful for running setup code, such as fetching resources or rendering.
    // appelé lorsque l'élément personnalisé est connecté pour la première fois au DOM du document
    connectedCallback() {
      console.log(`Custom element ${this.is} added to page.`);

      // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
      const shadowRoot = this.attachShadow({ mode: `open` });
      const template = _currentDoc.querySelector(`template`);
      const instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      this.runBehaviorMethods();

      this.createAllInternNodes();
      this.connectInternNodes();
      this.resetKnobs();
      this.setKnobsListeners();
      this.setValuesToKnobs();
      this.setPedalActive();
      this.setSwitchListener();
    }

    // ----- METHODS: CUSTOM -----
    createAllInternNodes() {
      this.effect = new Chorus("chorus", 1);
      this.effect.setup();
    }

    connectInternNodes() {
      this.soundNodeIn.connect(this.effect.getInputNode());
      this.effect.getOutputNode().connect(this.soundNodeOut);
    }

    setKnobsListeners() {
      this.shadowRoot.querySelector('#knob1').addEventListener('change', (e) => this.effect.setDelay(e.target.value / 100));
      this.shadowRoot.querySelector('#knob2').addEventListener('change', (e) => this.effect.setSpeed(parseFloat(e.target.value)));
      this.shadowRoot.querySelector('#knob3').addEventListener('change', (e) => this.effect.setDepth(e.target.value / 30000));
      this.shadowRoot.querySelector('#knob4').addEventListener('change', (e) => this.effect.setMix(e.target.value / 100));
    }

    getDefaultButtonsValues() {
      return {
        delay: 60,
        depth: 15,
        mix: 80,
        speed: 3.66
      };
    }

    bypass() {
      this.effect.bypass();
    }

    reactivate() {
      this.effect.reactivate();
    }

  });
})();