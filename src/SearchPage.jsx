import * as React from "react";
import * as _ from "lodash";
import { createStore } from 'redux'

import {
    SearchkitManager, SearchkitProvider,
    SearchBox, RefinementListFilter, MenuFilter, RangeFilter,
    Hits, HitsStats, NoHits, Pagination, SortingSelector,
    SelectedFilters, ResetFilters, ItemHistogramList,
    Layout, LayoutBody, LayoutResults, TopBar, ItemCheckboxList, TagCloud,
    SideBar, ActionBar, ActionBarRow, InputFilter, PageSizeSelector, Toggle,
    Tabs, ItemList, CheckboxItemList, DynamicRangeFilter, ViewSwitcherToggle, ViewSwitcherHits
} from "searchkit";

require("./index.scss");

let showTakePicture = false;
// a "reducer" that handleshowTakePicture some events and return a state
function takePictureToggle(showTakePicture = false, action) {
  return  action.type === 'TOGGLE' ? showTakePicture = !showTakePicture
        : showTakePicture;
}

let store = createStore(takePictureToggle)

const customHitStats = (props) => {
    const {resultsFoundLabel, bemBlocks, hitsCount, timeTaken} = props
    return (
        <div className={bemBlocks.container()} data-qa="hits-stats">
            <div className={bemBlocks.container("info")} data-qa="info">
                {hitsCount} People found
            </div>
      </div>
    )
}


const host = "https://search-sensibledata-mnmvjeckzqxbuqjpnrlamqgxhu.eu-central-1.es.amazonaws.com/faces";
const searchkit = new SearchkitManager(host);

// const AlbumHitsGridItem = (props)=> {
//   const {result} = props;
//
//   if (result) {
//     const source:any = _.extend({}, result._source, result.highlight);
//     //let url = "http://idowebsites.ch/sensibleData/images/" + source.file;
//     let url = source.file;
//
//
//     return (
//       <div className="sk-hits-grid-hit sk-hits-grid__item" data-qa="hit">
//           <img data-qa="face" className="sk-hits-grid-hit__face" src={url}/>
//           <div data-qa="title" className="sk-hits-grid-hit__title">{source.gender}, {source.age}yrs, B:{source.beauty}%, H:{source.happiness}%</div>
//       </div>
//     )
//   }
// };

export class FacesGrid extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { showFilters: "hideFilters", showInfos: "hideInfos"  };
    // this.handleFilterClick = this.handleFilterClick.bind(this);
    // this.handleInfoClick = this.handleInfoClick.bind(this);
    // this.handlePictureClick = this.handlePictureClick.bind(this);
  }

  handleFilterClick() {
    var css = (this.state.showFilters === "showFilters") ? "hideFilters" : "showFilters";
    this.setState({ showFilters: css });
}

  handleInfoClick() {
    var css = (this.state.showInfos === "showInfos") ? "hideInfos" : "showInfos";
    this.setState({ showInfos: css });
  }
  handlePictureClick() {
    store.dispatch({ type: 'TOGGLE' })
    // this.showTakePicture = !this.showTakePicture;
    // alert(store.getState());
    // this.forceUpdate();
  }
  render(){
    const { hits } = this.props
    const listItems = hits.map((hit) => {
      let titleValues = [hit._source.gender+" "+hit._source.age+"y"];
      let titleValuesLong = [hit._source.gender, hit._source.age+"yrs\n\n"];
      if (hit._source.happy) {
        titleValues.push("Ha:"+Math.round(hit._source.happy)+"%");
        titleValuesLong.push("Happy:"+Math.round(hit._source.happy)+"%");
      }
      if (hit._source.sad) {
        titleValues.push("Sa:"+Math.round(hit._source.sad)+"%");
        titleValuesLong.push("Sad:"+Math.round(hit._source.sad)+"%");
      }
      if (hit._source.confused) {
        titleValues.push("Co:"+Math.round(hit._source.confused)+"%");
        titleValuesLong.push("Confused:"+Math.round(hit._source.confused)+"%");
      }
      if (hit._source.surprised) {
        titleValues.push("Su:"+Math.round(hit._source.surprised)+"%");
        titleValuesLong.push("Surprised:"+Math.round(hit._source.surprised)+"%");
      }
      if (hit._source.calm) {
        titleValues.push("Ca:"+Math.round(hit._source.calm)+"%");
        titleValuesLong.push("Calm:"+hit._source.calm+"%");
      }
      return <div className="sk-hits-grid-hit sk-hits-grid__item" data-qa="hit">
          <div data-qa="facedata" className="sk-hits-grid-hit__facedata"><span>{titleValuesLong.join("\n")}</span></div>
          <img data-qa="face" className="sk-hits-grid-hit__face" src={hit._source.file}/>
          <div data-qa="title" className="sk-hits-grid-hit__title">{titleValues.join(' ')}</div>
      </div>
    });
    return (
      <div className="sk-hits-grid" data-qa="hits">
        <div  className="sk-hits-grid-hit sk-hits-grid__item btn-add btn-shoot"><a href="#" onClick={this.handlePictureClick}><img src="https://faceatlas.co/static/plus.svg" alt="+"></img></a></div>
       {listItems}
    </div>
    )
  }
}

const TakePictureButton = (props)=> {
  const {bemBlocks, result} = props;
    return (
      <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
          yolo
      </div>
    )
};




export class TakePicture extends React.Component {
  constructor(props) {
    super(props);
      Webcam.set({

        width:480,
        height:360,

        swfURL: "/webcam.swf",
        flashNotDetectedText: "Error: can't access your webcam. Please switch to a browser like Chrome or Firefox or install Adobe Flash Player",
        // device capture size
        dest_width: 480,
        dest_height: 360,

        // final cropped size
        crop_width: 360,
        crop_height: 360,

        image_format: 'jpeg',
        jpeg_quality: 90
      });
      Webcam.on( 'live', function() {
      // camera is live, showing preview image
      // (and user has allowed access)
      console.log("webcam live");
      document.getElementById('head-img').style.display = "block";
      document.getElementById('snapshot-wrapper').style.display = "block";
      } );
  }

  componentDidMount() {
          Webcam.attach( '#my_camera' );
  }

  componentWillUnmount() {
        Webcam.reset( '#my_camera' );
        searchkit.reloadSearch();
  }


  takeSnapshot() {
    Webcam.on('uploadProgress', function() {
      document.getElementById('snapshot-infos').innerHTML = "Trying to analyze your face. Please be patient.";
      document.getElementById('snapshot-infos').className += "animated shake infinite";
     } );


    // take snapshot and get image data
    Webcam.snap( function(data_uri) {
      // display results in page
      // document.getElementById('my_camera').innerHTML =
      //   '<img src="'+data_uri+'"/>';
      Webcam.freeze()
          Webcam.upload(data_uri, 'https://faceatlas.co/upload', function(code, text) {
        //Webcam.upload(data_uri, 'http://localhost:5000/upload', function(code, text) {
          console.log('upload complete. code: '+code+' text: '+text);
          document.getElementById('snapshot-infos').className = "";
          if (text == "2") {
            document.getElementById('snapshot-infos').innerHTML = "Sorry I could not recognize your face. Please try again";
            Webcam.unfreeze()
          } else if (text == "3") {
            document.getElementById('snapshot-infos').innerHTML = "Sorry I had troubles storing your face. Please try again.";
            Webcam.unfreeze()
          } else {
            document.getElementById('snapshot-infos').innerHTML = text;
            document.getElementById('snapshot-infos').className = "";
            searchkit.reloadSearch();
            document.getElementById('snapshot-button').style.display = "none";
            document.getElementById('close-takepicture-button').style.display = "block";
          }
        } );
    } );
  }

  render() {
    return (
      <div className="snapshot-view" id="snapshot-view">
      <p id="snapshot-infos" ref="snapshot-infos">Take a picutre please. Your mood and age will be detected by Amazon Rekognition</p>
    <div className="portrait_wrapper" id="portrait-wrapper">
        <img className="head-img" id="head-img" src="https://faceatlas.co/static/face.svg" />
  		<div id="my_camera"></div>
  </div>	<div className="snapshot-wrapper btn-add" id="snapshot-wrapper">
  		<a href="#" id="snapshot-button" onClick={ this.takeSnapshot }>Cheese!</a>
  	</div>
    </div>
    )
  }
}


export class SearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showFilters: "hideFilters", showInfos: "hideInfos", showTakePicture: false };
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
    this.handlePictureClick = this.handlePictureClick.bind(this);
  }

  handleFilterClick() {
    var css = (this.state.showFilters === "showFilters") ? "hideFilters" : "showFilters";
    this.setState({ showFilters: css });
}

componentWillMount() {
  store.subscribe(() =>
  this.setState({ showTakePicture: store.getState() })
)
}

  handleInfoClick() {
    var css = (this.state.showInfos === "showInfos") ? "hideInfos" : "showInfos";
    this.setState({ showInfos: css });
  }
  handlePictureClick() {
    store.dispatch({ type: 'TOGGLE' }) // 1
    //showTakePicture = !showTakePicture;
    //this.forceUpdate();
  }



	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
		    <Layout>

        {this.state.showTakePicture ? (
          <div className="showInfos">
            <div className="btn-close"><a href="#" onClick={ this.handlePictureClick } >
                <img className="close-img" src="https://faceatlas.co/static/close.svg" /></a></div>
            <div className="modal-snap"><TakePicture />
        </div>
        </div>
        ) :
           null
        }
		      {/*<TopBar>
          <img src="logo.png" alt="logo" />
		       </TopBar>*/}
		      <LayoutBody className={this.state.showFilters}>
            <div className={ this.state.showInfos }>
              <div className="modal-text"> <p>Face Atlas is a playful study of <a href="https://aws.amazon.com/rekognition/">Amazon Rekognition</a>'s definition of happiness and other emotions. A post-privacy examination of todays computer people knowledge.</p>
<p>Made by <a href="https://twitter.com/m_hertig">m-hertig</a> using AWS, Rekognition, Elasticsearch, Searchkit & React</p>
<p>Many thanks to Pawel, JJ, Ben, Hupf and Josh for their help</p>
  <div className="btn-add"><a href="#" onClick={ this.handleInfoClick } >OK</a></div>
</div>
            </div>
          <SideBar className={this.state.showFilters}>
            <div className="filter-buttons">
<div  className="btn-add"><a href="#" onClick={ this.handlePictureClick }>Take a picture</a></div><div className="btn-filter" onClick={ this.handleFilterClick }></div>
  </div>
          <span className="sidebar-filters">
            <RangeFilter
                id="happy"
                field="happy"
                min={0}
                max={100}
                showHistogram={true}
                title="Happy %"/>
            <RangeFilter
                id="sad"
                field="sad"
                min={1}
                max={100}
                showHistogram={true}
                title="Sad %"/>
            <RangeFilter
                id="confused"
                field="confused"
                min={1}
                max={100}
                showHistogram={true}
                title="Confused %"/>
            <RangeFilter
                id="surprised"
                field="surprised"
                min={1}
                max={100}
                showHistogram={true}
                title="Surprised %"/>
            <RangeFilter
                id="calm"
                field="calm"
                min={1}
                max={100}
                showHistogram={true}
                title="Calm %"/>
            <RangeFilter
                id="age"
                field="age"
                min={0}
                max={100}
                showHistogram={true}
                title="Age"/>
							<MenuFilter
								id="gender"
								title="Gender"
								field="gender"
								listComponent={ItemHistogramList}
                size={2}/>
                <div className="sk-panel__header">Sort by</div>
                <SortingSelector options={[
                  {label:"Newest first", field:"timestamp", order:"desc", defaultOption:true},
                  {label:"Beauty", field:"beauty", order:"desc"},
                  {label:"Age", field:"age", order:"desc"},
                  {label:"Happiness", field:"happiness", order:"desc"}
                ]}/>
                <div className="btn-info"><a onClick={ this.handleInfoClick } href="#">?</a></div>
                </span>
		        </SideBar>
		        <LayoutResults>
		          <ActionBar>
		            <ActionBarRow>
		              <HitsStats component={customHitStats}/>
                  <ViewSwitcherToggle/>
		            </ActionBarRow>
		            <ActionBarRow>
		              <SelectedFilters/>
		              <ResetFilters/>
		            </ActionBarRow>
		          </ActionBar>
              <Hits
                  hitsPerPage={50} listComponent={FacesGrid} handlePictureClick={this.state.handlePictureClick}
                  scrollTo="body" />
		          <NoHits translations={{
        "NoHits.NoResultsFound":"Oh no. Nobody found with this set of filters." }}/>
							<Pagination/>
		        </LayoutResults>

		      </LayoutBody>
		    </Layout>
		  </SearchkitProvider>
		)
	}
}
