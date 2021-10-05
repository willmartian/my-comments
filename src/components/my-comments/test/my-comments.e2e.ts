import { newE2EPage } from '@stencil/core/testing';

describe('my-comments', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<my-comments></my-comments>');

    const element = await page.find('my-comments');
    expect(element).toHaveClass('hydrated');
  });
});
