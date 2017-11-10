/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Dimensions
} from 'react-native';
import Carousel from "./CardCarousel"
const {width, height} = Dimensions.get('window')

export default class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      movies: []
    }
  }

  componentDidMount() {
    fetch('https://facebook.github.io/react-native/movies.json')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({movies:responseJson.movies})
    })
    .catch((error) => {
      console.error(error);
    }) 
  }

  render() {

    console.log("reRender!")
  
    return (
      <View style = {styles.container}>
        <View style = {{flex: 1, backgroundColor: 'red'}}/>
        <View style = {{flex: 3.5, backgroundColor: 'skyblue'}}>
        <FlatList 
          onMomentumScrollBegin = {()=> console.log("onMomentumScrollBegin")}
          onMomentumScrollEnd = {()=>console.log("onMomentumScrollEnd")}
          onScroll = {()=>console.log("onScroll")}
          stickyHeaderIndices={[0]}
          data={this.state.movies}
          contentContainerStyle = {{paddingTop: 100}}
          keyExtractor={(_,index) => index}
          renderItem={({item}) => {
            return(
            <View style ={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
              <Text>{item.title}</Text>
            </View>
            )
          }
        }
        />
        </View>
        <View style = {{flex:2, backgroundColor: 'rgb(216, 224, 98)', alignItems: 'center'}}>
        <Carousel containerStyle = {{ backgroundColor: 'blue',}}  pageStyle={ {backgroundColor: "white", borderRadius: 10, height: 180} } sneak = {60}
                  pageWidth = {200}
        >
          <Text>Hello</Text>
          <Text>Hello</Text>
          <Text>Hello</Text>
          <Text>Hello</Text>
          <Text>Hello</Text>
          <Text>Hello</Text>
          <Text>Hello</Text>
          <Text>Hello</Text>
        </Carousel>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    width : width * 0.9,
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 100,
    marginHorizontal: 10

  },
  cardContents: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500'
  }
})

const Card = props => (
  <View style = {styles.card}>
    <Text style = {styles.cardContents}>{props.number}</Text>
  </View>
)
