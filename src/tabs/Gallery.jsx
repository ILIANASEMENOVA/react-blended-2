import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';

export class Gallery extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isEmpty: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    const prevQuery = prevState.query;
    const prevPage = prevState.page;

    if (prevQuery == query && prevPage === page) {
      return;
    }

    const { photos, total_results } = await ImageService.getImages(query, page);
    if (!total_results) {
      this.setState({ isEmpty: true });
      return;
    }

    this.setState(prevState => ({ images: [...prevState.images, ...photos] }));
  }

  handleSubmit = query => {
    this.setState({ query, images: [], page: 1, isEmpty: false });
  };

  render() {
    const { images, page, isEmpty } = this.state;

    return (
      <>
        <SearchForm handleSubmit={this.handleSubmit} />
        <Grid>
          {images.map(({ id, avg_color, alt, src }) => (
            <GridItem key={id}>
              <CardItem color={avg_color}>
                <img src={src.large} alt={alt} />
              </CardItem>
            </GridItem>
          ))}
        </Grid>
        {isEmpty && (
          <Text textAlign="center">Sorry. There are no images ... 😭</Text>
        )}
      </>
    );
  }
}
