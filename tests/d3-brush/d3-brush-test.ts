/**
 * Typescript definition tests for d3/d3-brush module
 *
 * Note: These tests are intended to test the definitions only
 * in the sense of typing and call signature consistency. They
 * are not intended as functional tests.
 */

import * as d3Brush from '../../src/d3-brush';
import { ArrayLike, event, select, Selection } from '../../src/d3-selection';
import { Transition } from '../../src/d3-transition';

// -----------------------------------------------------------------------------
// Preparatory Steps
// -----------------------------------------------------------------------------

interface BrushDatum {
    extent: [[number, number], [number, number]];
    filterZoomEvent: boolean;
}


// -----------------------------------------------------------------------------
// Test Define BrushBehavior
// -----------------------------------------------------------------------------

let brush: d3Brush.BrushBehavior<BrushDatum> = d3Brush.brush<BrushDatum>();

let brushX: d3Brush.BrushBehavior<BrushDatum> = d3Brush.brushX<BrushDatum>();

let brushY: d3Brush.BrushBehavior<BrushDatum> = d3Brush.brushY<BrushDatum>();

// extent() ----------------------------------------------------------------------

let extent: (this: SVGGElement, d: BrushDatum, i: number, group: Array<SVGGElement> | ArrayLike<SVGGElement>) => [[number, number], [number, number]];
extent = brush.extent();

// chainable with array
brush = brush.extent([[0, 0], [300, 200]]);

// chainable with function
brush = brush.extent(function (d, i, group) {
    console.log('Owner SVG Element of svg group: ', this.ownerSVGElement); // this is of type SVGGElement
    return d.extent; // datum of type BrushDatum
});

// filter() ----------------------------------------------------------------

// chainable
brush = brush.filter(function (d, i, group) {

    // Cast d3 event to D3ZoomEvent to be used in filter logic
    let e = <d3Brush.D3BrushEvent<BrushDatum>>event;

    console.log('Owner SVG Element of svg group: ', this.ownerSVGElement); // this is of type SVGGElement
    return e.sourceEvent.type !== 'zoom' || !d.filterZoomEvent; // datum type is BrushDatum (as propagated to SVGGElement with brush event attached)
});

let filterFn: (this: SVGGElement, d?: BrushDatum, index?: number, group?: Array<SVGGElement>) => boolean;
filterFn = brush.filter();

// handleSize() ----------------------------------------------------------------

// chainable
brush = brush.handleSize(7);
let handleSize: number = brush.handleSize();

// on() ------------------------------------------------------------------------

let brushed: (this: SVGGElement, datum: BrushDatum, index: number, group: Array<SVGGElement> | ArrayLike<SVGGElement>) => void;
let wrongHandler1: (this: SVGSVGElement, datum: BrushDatum, index: number, group: Array<SVGSVGElement> | ArrayLike<SVGSVGElement>) => void;
let wrongHandler2: (this: SVGGElement, datum: { test: string }, index: number, group: Array<SVGGElement> | ArrayLike<SVGGElement>) => void;

// chainable
brush = brush.on('end', brushed);
// brush = brush.on('end', wrongHandler1); // fails, wrongHandler event handler has wrong this
// brush = brush.on('end', wrongHandler2); // fails, wrongHandler event handler has wrong datum type


brushed = brush.on('end');

// chainable remove handler
brush = brush.on('end', null);

// re-apply
brush.on('end', function (d, i, group) {
    console.log('Owner SVG Element of svg group: ', this.ownerSVGElement); // this is of type SVGGElement
    console.log('Extent as per data: ', d.extent); // datum of type BrushDatum
    // do anything
});



// -----------------------------------------------------------------------------
// Test Attach Brush Behavior
// -----------------------------------------------------------------------------

let g = select<SVGSVGElement, any>('svg')
    .append<SVGGElement>('g')
    .classed('brush', true)
    .datum<BrushDatum>({
        extent: [[0, 0], [300, 200]],
        filterZoomEvent: true
    });

g.call(brush);

let gX = select<SVGSVGElement, any>('svg')
    .append<SVGGElement>('g')
    .classed('brush', true)
    .datum<BrushDatum>({
        extent: [[0, 0], [300, 200]],
        filterZoomEvent: true
    });


gX.call(brushX);


// -----------------------------------------------------------------------------
// Test Use Brush Behavior
// -----------------------------------------------------------------------------

let gTransition = g.transition();

// 2d brush move with Selection
brush.move(g, [[10, 10], [50, 50]]); // two-dimensional brush
brush.move(g, function (d, i, group) {
    console.log('Owner SVG Element of svg group: ', this.ownerSVGElement); // this is of type SVGGElement
    let selection: [[number, number], [number, number]];
    selection[0][0] = d.extent[0][0] + 10; // datum type is brushDatum
    selection[0][1] = d.extent[0][1] + 10;
    selection[1][0] = d.extent[0][0] + 40;
    selection[1][1] = d.extent[0][1] + 40;
    return selection;
});

// 2d brush move with Transition
brush.move(gTransition, [[10, 10], [50, 50]]); // two-dimensional brush
brush.move(gTransition, function (d, i, group) {
    console.log('Owner SVG Element of svg group: ', this.ownerSVGElement); // this is of type SVGGElement
    let selection: [[number, number], [number, number]];
    selection[0][0] = d.extent[0][0] + 10; // datum type is brushDatum
    selection[0][1] = d.extent[0][1] + 10;
    selection[1][0] = d.extent[0][0] + 40;
    selection[1][1] = d.extent[0][1] + 40;
    return selection;
});


let gXTransition = gX.transition();

// 1d brush move with Selection
brush.move(gX, [10, 40]); // two-dimensional brush
brush.move(gX, function (d, i, group) {
    console.log('Owner SVG Element of svg group: ', this.ownerSVGElement); // this is of type SVGGElement
    let selection: [number, number];
    selection[0] = d.extent[0][0] + 10; // datum type is brushDatum
    selection[1] = d.extent[0][0] + 40;
    return selection;
});

// 1d brush move with Transition
brush.move(gXTransition, [10, 40]); // two-dimensional brush
brush.move(gXTransition, function (d, i, group) {
    console.log('Owner SVG Element of svg group: ', this.ownerSVGElement); // this is of type SVGGElement
    let selection: [number, number];
    selection[0] = d.extent[0][0] + 10; // datum type is brushDatum
    selection[1] = d.extent[0][0] + 40;
    return selection;
});


// -----------------------------------------------------------------------------
// Test Brush Event Interface
// -----------------------------------------------------------------------------


let e: d3Brush.D3BrushEvent<BrushDatum>;


let target: d3Brush.BrushBehavior<BrushDatum> = e.target;
let type: 'start' | 'brush' | 'end' | string = e.type;
let brushSelection: d3Brush.BrushSelection = e.selection;
let sourceEvent: any = e.sourceEvent;
