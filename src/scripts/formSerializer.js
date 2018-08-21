/**
 * FormSerializer
 * (c) 2018 Jeremy "Jermbo" Lawson, MIT License,
 *
 * @param {String} elems    All the form elements
 * @param {Object} options  Base params for how to split fields and name propery [optional]
 * @returns {Object}        Public API
 */
const FormSerializer = function(elems, options) {
    const opts = {
      textSeparator: "; ",
      nameSplitter: "."
    };
    const defaults = Object.assign(opts, options || {});
    const inputs =
      typeof elems == "string" ? document.querySelectorAll(elems) : elems;
    let finalObj;

    /**
     * formToJSON
     * Builds an object based on the name attribute.
     *
     * @param {none}
     * @returns {Object}
     */
    function formToJSON() {
      finalObj = {};
      inputs.forEach(input => {
        const keys = input.name.split(defaults.nameSplitter);
        const lastKey = keys.pop();
        const lastObj = keys.reduce(
          (obj, key) => (obj[key] = obj[key] || {}),
          finalObj
        );

        if (input.type == "checkbox") {
          if (!input.checked) return;
          if (!lastObj[lastKey]) lastObj[lastKey] = [];
          lastObj[lastKey].push(input.value);
          return;
        }

        if (input.type == "radio") {
          if (!input.checked) return;
          lastObj[lastKey] = input.value;
          return;
        }

        if (input.type == "textarea") {
          lastObj[lastKey] = input.value
            ? input.value.split(defaults.textSeparator)
            : [];
          return;
        }

        lastObj[lastKey] = input.value;
      });

      return finalObj;
    }

    /**
     * jsonToForm
     * Populates form fields based from the objects keys
     * and inputs name property
     *
     * @param {Object} data
     * @returns {none}
     */
    function jsonToForm(data) {
      inputs.forEach(input => {
        const keys = input.name.split(defaults.nameSplitter);
        const value = keys.reduce(
          (prev, curr) => (prev ? prev[curr] : null),
          data
        );

        if (input.type == "radio") {
          if (input.value != value) return;
          input.checked = true;
          return;
        }

        if (input.type == "checkbox") {
          value.forEach(v => {
            if (input.value != v) return;
            input.checked = true;
            return;
          });
          return;
        }

        if (input.type == "textarea") {
          if (Array.isArray(value)) {
            input.value = value
              .map((val, i) => (i < value.length - 1 ? `${val}; ` : val))
              .join("");
            return;
          }
        }

        if (Array.isArray(value)) {
          input.value = value
            .map((val, i) => (i < value.length - 1 ? `${val}; ` : val))
            .join("");
          return;
        }

        input.value = value;
      });
    }

    /**
     * resetForm
     * Clear all form values, uncheck all boxes and radios,
     * reset all select boxes, and reset all textareas.
     *
     * @param {none}
     * @returns {none}
     */
    function resetForm() {
      inputs.forEach(input => {
        if (input.type == "checkbox" || input.type == "radio") {
          input.checked = false;
          return;
        }
        input.value = "";
      });
    }

    return {
      formToJSON: formToJSON,
      jsonToForm: jsonToForm,
      resetForm: resetForm
    };
  };