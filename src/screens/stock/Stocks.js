import { Button, Container, Fab, Icon } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { deleteById, findAll } from '../../actions/stock';
import CustomHeader from '../../components/CustomHeader';
import RowItem from '../../components/RowItem';
import RowEmpty from '../../components/RowEmpty';
import { showError } from '../../utils/toast';
import styles from '../styles';

class Stocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      total: 0,
      search: '',
      params: {
        search: '',
        sort: 'asc',
        page: 0,
        size: 20
      }
    };
  }

  componentDidMount() {
    this.reload(this.state.params);
  }

  componentDidUpdate(prevProps) {
    const { data, error, saveData, deleteData, deleteError } = this.props;
    if (prevProps.data !== data) {
      this.setState({
        data: [...this.state.data, ...data?.list],
        total: data.total,
        search: this.state.params.search,
        params: {
          ...this.state.params,
          page: data.page
        }
      });
    } else if (
      prevProps.deleteData !== deleteData ||
      prevProps.saveData !== saveData
    ) {
      this.onRefresh();
    } else if (error && prevProps.error !== error) {
      showError(error);
    } else if (deleteError && prevProps.deleteError !== deleteError) {
      showError(deleteError);
    }
  }

  reload({ search, sort = 'asc', page = 0 } = {}) {
    this.props.findAll({ search: { name: search }, sort, page });
  }

  onRefresh = () => {
    const { params } = this.state;
    this.setState(
      {
        data: [],
        total: 0,
        params: { ...params, page: 0 }
      },
      () => this.reload(this.state.params)
    );
  };

  onEndReached = () => {
    const { data, total, params } = this.state;

    if (data.length < total) {
      this.reload({
        ...params,
        page: params.page + 1
      });
    }
  };

  onSearch = () => {
    const { search, params } = this.state;
    this.setState(
      {
        data: [],
        total: 0,
        params: { ...params, search: search, page: 0 }
      },
      () => this.reload(this.state.params)
    );
  };
  onChangeText = () => {};

  onDelete = item => {
    Alert.alert(
      'Confirmation',
      'Delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { text: 'OK', onPress: () => this.props.deleteById(item.id) }
      ],
      { cancelable: true }
    );
  };

  onShowForm = () => {
    this.props.navigation.navigate('FormStock');
  };

  render() {
    const { navigation, loading } = this.props;
    const { data } = this.state;
    return (
      <Container>
        <CustomHeader
          navigation={navigation}
          title="Stocks"
          hideLeftButton={true}
          showRightButton={true}
        />
        <View style={styles.content}>
          <SwipeListView
            contentContainerStyle={styles.swipeListView}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={this.onRefresh} />
            }
            data={data}
            renderItem={({ item }) => (
              <RowItem navigation={navigation} item={item} type="stock" />
            )}
            keyExtractor={item => item.id.toString()}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.5}
            renderHiddenItem={data => (
              <View style={styles.hiddenItem}>
                <Button
                  style={styles.deleteButton}
                  danger
                  onPress={() => this.onDelete(data.item)}
                >
                  <Icon name="md-trash" />
                </Button>
              </View>
            )}
            rightOpenValue={-75}
            ListEmptyComponent={!loading && <RowEmpty />}
          />
        </View>
        <Fab
          position="bottomRight"
          style={styles.fab}
          onPress={this.onShowForm}
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

Stocks.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.any,
    total: PropTypes.any
  }),
  deleteById: PropTypes.func,
  deleteData: PropTypes.any,
  deleteError: PropTypes.any,
  error: PropTypes.any,
  findAll: PropTypes.func,
  loading: PropTypes.any,
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  }),
  saveData: PropTypes.any
};

const mapStateToProps = state => ({
  data: state.stocks.data,
  saveData: state.saveStock.data,
  deleteData: state.deletedStockById.data,
  loading: state.stocks.loading || state.deletedStockById.loading,
  error: state.stocks.error,
  deleteError: state.deletedStockById.error
});

const mapDispatchToProps = {
  findAll,
  deleteById
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stocks);
