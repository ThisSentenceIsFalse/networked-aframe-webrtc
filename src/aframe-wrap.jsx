// So what I aimed to do is to isolate the hierarchy
// concerned with AFrame rendering from React entirely.
// Why? Because:
// 1. React's way of handling the real DOM upon change is
// unspecified and implementation-defined:
// - what exactly it watches: changes to nodes by reference/
//   by any attribute set on the nodes, by a specific subset of
//   attributes, changes to all children, or just those
//   corresponding to the virtual DOM etc.
// - what exactly it does: probably complete node replacing,
//   but in some cases it may simply reset existing nodes, for
//   performance reasons perhaps;
//
//   You don't know unless you delve in the implementation. And
//   you wouldn't want that anyway, since it opens the risk of
//   coupling your implementation to the specific version of
//   React you use.
//
// 2. AFrame _possibly_ does some DOM manipulation already, which
//   can trigger React updates. It could be just attaching some
//   data members, it could be more. This is one of the plausible
//   explanations of the presented issue: you do some
//   modifications via AFrame interactions, React picks up on them,
//   it rerenders as specified by the component; your component is
//   pure? Everything back to square 1.
//
// 3. Even if AFrame and React do not overstep each other's area -
//   it's quite possible wrapping some components in React will incur
//   a performance penalty. Maybe you could use a library for this:
//   https://www.npmjs.com/search?q=react%20aframe - there are caveats
//   to some of them though. The paradigm promoted by React
//   differs in places from patterns for high-perf real-time
//   applications.
//
// 4. I am not quite sure how React handles raw elements with
//   non-standard tags - there is the possibility of
//   implementing custom classes for them but it seems like
//   it handles them relatively well even without. Still,
//   template tags were problematic as mentioned.

import React from 'react';
// https://webpack.js.org/loaders/html-loader/
// Loads the aframe-specific HTML as a string, useful below
import AFrameContent from './aframe-content.html';

function configMobile() {
  // On mobile remove elements that are resource heavy
  var isMobile = AFRAME.utils.device.isMobile();

  if (isMobile) {
    var particles = document.getElementById('particles');
    particles.parentNode.removeChild(particles);
  }
}

function setupColorScheme() {
  // Define custom schema for syncing avatar color, set by random-color
  NAF.schemas.add({
    template: '#avatar-template',
    components: [
      'position',
      'rotation',
      {
        selector: '.head',
        component: 'material',
        property: 'color'
      }
    ]
  });
}

// Called by Networked-Aframe when connected to server
function onConnect () {
  console.log("onConnect", new Date());
}

class AFrameWrap extends React.Component {
  // Functional components apparently use shallow diffing of input
  // to prevent updates, maybe that could trigger a reset too. So I
  // went for the class component, with updates completely disabled.
  // https://reactjs.org/docs/integrating-with-other-libraries.html
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    // Ugly, just for demonstration purposes.
    this.el.innerHTML = AFrameContent;

    configMobile();
    setupColorScheme();
  }

  render() {
      return (
        <div id="aframe-wrap" ref={el => this.el = el}>
        </div>
      )
    }
  }

  export default AFrameWrap;