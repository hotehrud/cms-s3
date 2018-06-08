export const Drop = {
  data() {
    return {
      dropCallback: null
    };
  },
  methods: {
    handleDrop(e) {
      const dt = e.dataTransfer;
      this.dropCallback(dt, "drop");
    },
    highlight() {
      this.$el.classList.add("highlight");
    },
    unhighlight() {
      this.$el.classList.remove("highlight");
    },
    preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    dropEvent(callback) {
      this.dropCallback = callback;

      ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        this.$el.addEventListener(eventName, this.preventDefaults, false);
      });

      ["dragenter", "dragover"].forEach(eventName => {
        this.$el.addEventListener(eventName, this.highlight, false);
      });

      ["dragleave", "drop"].forEach(eventName => {
        this.$el.addEventListener(eventName, this.unhighlight, false);
      });

      this.$el.addEventListener("drop", this.handleDrop, false);
    },
    removeDropEvent() {
      ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        this.$el.removeEventListener(eventName, this.preventDefaults, false);
      });

      ["dragenter", "dragover"].forEach(eventName => {
        this.$el.removeEventListener(eventName, this.highlight, false);
      });

      ["dragleave", "drop"].forEach(eventName => {
        this.$el.removeEventListener(eventName, this.unhighlight, false);
      });

      this.$el.removeEventListener("drop", this.handleDrop, false);
    }
  }
};
