import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';

export class Gallery extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isEmpty: false,
    isLoadMore: false,
    error: null,
    isLoading: false,
    src: '',
  };

  async componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    const prevQuery = prevState.query;
    const prevPage = prevState.page;

    if (prevQuery === query && prevPage === page) {
      return;
    }
    this.setState({ isLoading: true });
    try {
      const { photos, total_results } = await ImageService.getImages(
        query,
        page
      );

      if (!total_results) {
        this.setState({ isEmpty: true });
        return;
      }
      this.setState(prevState => ({
        images: [...prevState.images, ...photos],
        isLoadMore: page < Math.ceil(total_results / 15),
      }));
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  handleSubmit = query => {
    this.setState({ query, images: [], page: 1, isEmpty: false });
  };

  handleClick = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  openModal = src => {
    this.setState({ src });
  };

  render() {
    const { images, isEmpty, isLoadMore, error, isLoading, src } = this.state;

    return (
      <>
        <SearchForm handleSubmit={this.handleSubmit} />
        <Grid>
          {images.map(({ id, avg_color, alt, src }) => (
            <GridItem key={id}>
              <CardItem color={avg_color}>
                <img
                  src={src.large}
                  alt={alt}
                  onClick={() => {
                    this.openModal(src.large);
                  }}
                />
              </CardItem>
            </GridItem>
          ))}
        </Grid>
        {isEmpty && (
          <Text textAlign="center">Sorry. There are no images ... 😭</Text>
        )}
        {error && <Text textAlign="center">{error}😭</Text>}
        {isLoadMore && <Button onClick={this.handleClick}>Load more</Button>}
        {isLoading && <Loader />}
        {src && <Modal src={src} onClose={this.openModal} />}
      </>
    );
  }
}
