import { newSpecPage } from '@stencil/core/testing';
import { MyComments } from '../my-comments';

describe('my-comments', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MyComments],
      html: `<my-comments></my-comments>`,
    });
    expect(page.root).toEqualHtml(`
      <my-comments>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </my-comments>
    `);
  });
});
