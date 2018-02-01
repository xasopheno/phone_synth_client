import React, { Component } from 'react';
import Progress from 'react-progressbar';

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      data: null,
    };
  }

  componentWillMount(){
    this.getRedditJSON_async()
  }

  getRedditJSON_async() {
    const request = async () => {
      const response = await fetch('https://www.reddit.com/r/MachineLearning.json');
      const json = await response.json();
      const children = await json.data.children;
      this.setState({
          ...this.state,
          data: this.preparePosts(children)
        });
    };
    return request()
}

  preparePosts(posts){
    let sorted_posts = this.sortByScore(posts);
    let top_10_posts = sorted_posts.slice(0,10);
    return top_10_posts
  }

  sortByScore(posts){
    return posts.sort(function (b, a) {return a.data.score - b.data.score});
  }

  scale_score(score) {
    const old_max = this.state.data[0].data.score;
    const old_min = this.state.data[9].data.score;
    const old_percent = (score - old_min) / (old_max - old_min);
    return (100 * old_percent);
  }

  renderPosts(){
    if (this.state.data) {
      return this.state.data.map(post => {
        return this.renderPost(post)
      })
    }
  }

  renderProgressBar(percent){
    return (
      <div>
        <Progress
          completed={percent}
          color={"black"}
        />
      </div>
    );
  }

  renderPost(post) {
    let bar_length = this.scale_score(post.data.score);
    return (
      <div key={post.data.id}>
        <p>{post.data.title}</p>
        <p>Score: {post.data.score}</p>
        <div className="myProgress">
          <div className="myBar"></div>
        </div>
        {this.renderProgressBar(bar_length)}
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <h2>| Thank you |</h2>
        {
          this.renderPosts()
        }
      </div>
    );
  }
}

export default Main;
