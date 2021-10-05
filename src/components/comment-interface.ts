export type MyComment = {
  /*
   * The id of the author who wrote the comment.
   */
  author_id: string;

  /*
   * The body of the comment.
   */
  content: string;

  /*
   * The datetime when the comment was first posted.
   */
  created_at: string;

  /*
   * The `id` of the component that created this comment.
   * For example, <my-comments id="blog-post-1"> would create and retrieve comments with
   * a `location_id` of "blog-post-1".
   */
  location_id: string;

  /*
   * A unique id for the comment, generated by Supabase.
   */
  id: string;
}
