import { Component, Host, h, Element, Prop, State } from '@stencil/core';
import { MyComment } from '../comment-interface';
import { createClient, SupabaseClient } from '@supabase/supabase-js';


@Component({
  tag: 'my-comments',
  styleUrl: 'my-comments.css',
  shadow: true,
})
export class MyComments {

  /**
   * We don't need a Prop for `id`, since it is a global HTML attribute.
   * Instead, we can get grab it from the HTML element with the @Element decorator.
   */
  @Element() element;

  /**
   * Public URL to the Supabase backend.
   */
  @Prop() supabaseUrl: string;

  /**
   * Public access token to the Supabase backend.
   */
  @Prop() supabaseKey: string;

  /**
   * Comments associated with this block's `id`.
   */
  @State() comments: MyComment[] = [];

  /**
   * Value of the new comment text input.
   */
  @State() newCommentValue: string;

  /**
   * Supabase client to be initialized with `supabaseUrl` and `supabaseKey`.
   * We will import this type when we install Supabase.
   */
  private supabase: SupabaseClient;

  componentWillLoad() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    this.getComments();
    this.watchComments();
  }

  private async getComments() {
    const { data } = await this.supabase
      // Grab data from the 'comments' table.
      .from('comments')
      .select()
      // Only grab data that is associated with this component's `id`.
      .eq('location_id', this.element.id)
      // Order the data such that new comments are the top of the list.
      .order('created_at', { ascending: false });

    // Store the response in the `comments` state variable.
    this.comments = data;
  }

  private async watchComments() {
    await this.supabase
      // Only watch updates that match our component's id
      .from(`comments:location_id=eq.${this.element.id}`)
      // When a comment is inserted into the table, update the component state.
      .on('INSERT', payload => {
        this.comments = [payload.new, ...this.comments];
      })
      .subscribe()
  }

  private async addComment() {
    const { data } = await this.supabase
      .from('comments')
      .insert([
        {
          content: this.newCommentValue,
          author_id: 'test-author-1', // TODO: Add auth
          location_id: this.element.id
          // Supabase will automatically generate `id` and `created_at`
        }
      ]);
    return data;
  }

  private renderComment(comment: MyComment) {
    return (
      <article role="comment">
        <header>
          <h1>{comment.author_id}</h1>
        </header>
        <p>{comment.content}</p>
        <footer>
          <small><time dateTime={comment.created_at}>{comment.created_at}</time></small>
        </footer>
      </article>
    );
  }

  private handleChange(ev: Event) {
    const target = ev.currentTarget as HTMLInputElement;
    this.newCommentValue = target.value;
  }

  private handleSubmit(ev: Event) {
    // Prevent the default event behavior to keep the page from refreshing.
    ev.preventDefault();
    this.addComment();
  }

  render() {
    return (
      <Host>
        <h1>Comments</h1>

        <form onSubmit={(ev: Event) => this.handleSubmit(ev)}>
          <textarea
            rows={5}
            placeholder="Add a comment..."
            value={this.newCommentValue}
            onChange={(ev: Event) => this.handleChange(ev)}
          ></textarea>
          <input type="submit" value="Submit"/>
        </form>

        {this.comments.map(comment => this.renderComment(comment))}
      </Host>
    );
  }

}
