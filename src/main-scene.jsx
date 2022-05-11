import React from 'react';
import { createRoot } from 'react-dom/client';
import AFrameWrap from './aframe-wrap.jsx';

let rootNode = document.getElementById('react-root');

// this guard ensures we only use it for the webrtc
// example where the current issue is addressed
if (rootNode) {
    let root = createRoot(rootNode);

    root.render(
        <AFrameWrap/>
    );
}


