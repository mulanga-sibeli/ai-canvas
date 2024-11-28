// Config for mathjax which is used to display mathematical symbols.
import {MathJax2Config} from "better-react-mathjax";

export const MathJaxConfig = {
    loader: { load: ["input/tex", "output/chtml"] },
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        tags: 'ams'
    },
    chtml: {
        displayAlign: 'left',
        displayIndent: '2em'
    }
} as MathJax2Config