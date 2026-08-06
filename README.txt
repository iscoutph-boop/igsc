IG Sabroso testimonial test stability fix

Root cause:
The previous test waited for one hard-coded testimonial sentence. The panel
changes automatically, so the exact sentence is not a stable UI requirement.

The replacement test verifies the actual approved requirements:
- a labelled Client testimonials region renders;
- the region contains a blockquote;
- the region contains no buttons;
- the region contains no links/manual controls.

Production slider code is not changed.

Verification:
npm.cmd run lint -- --fix
npm.cmd run lint
npm.cmd test -- src/features/home/home-page.test.tsx --reporter=verbose
npm.cmd test
npm.cmd run build
