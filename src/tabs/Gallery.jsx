import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';
import { useEffect, useState } from 'react';

export const Gallery = () => {
  // state = {
  //   query: '',
  //   images: [],
  //   page: 1,
  //   isEmpty: false,
  //   isLoadMore: false,
  //   error: null,
  //   isLoading: false,
  //   src: '',
  // };

  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (!query) {
      return;
    }
    const fecthPhotos = async () => {
      setIsLoading(true);
      try {
        const { photos, total_results } = await ImageService.getImages(
          query,
          page
        );

        if (!total_results) {
          setIsEmpty(true);
          return;
        }
        setImages(prevState => [...prevState, ...photos]);
        setIsLoadMore(page < Math.ceil(total_results / 15));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fecthPhotos();
  }, [query, page]);

  const handleSubmit = query => {
    setQuery(query);
    setImages([]);
    setPage(1);
    setIsEmpty(false);
  };

  const handleClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = src => {
    setSrc(src);
  };

  return (
    <>
      <SearchForm handleSubmit={handleSubmit} />
      <Grid>
        {images.map(({ id, avg_color, alt, src }) => (
          <GridItem key={id}>
            <CardItem color={avg_color}>
              <img
                src={src.large}
                alt={alt}
                onClick={() => {
                  openModal(src.large);
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
      {isLoadMore && <Button onClick={handleClick}>Load more</Button>}
      {isLoading && <Loader />}
      {src && <Modal src={src} onClose={openModal} />}
    </>
  );
};
