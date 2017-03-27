import * as React from "react";
import * as _ from "lodash";

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

const AlbumHitsGridItem = (props)=> {
  const {result} = props;

  if (result) {
    const source:any = _.extend({}, result._source, result.highlight);
    //let url = "http://idowebsites.ch/sensibleData/images/" + source.file;
    let url = source.file;


    return (
      <div className="sk-hits-grid-hit sk-hits-grid__item" data-qa="hit">
          <img data-qa="face" className="sk-hits-grid-hit__face" src={url}/>
          <div data-qa="title" className="sk-hits-grid-hit__title">{source.gender}, {source.age}yrs, B:{source.beauty}%, H:{source.happiness}%</div>
      </div>
    )
  }
};

export class FacesGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showFilters: "hideFilters", showInfos: "hideInfos", showTakePicture: false  };
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
    this.handlePictureClick = this.handlePictureClick.bind(this);
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

      alert("yo");
    this.setState({ showTakePicture: !this.state.showTakePicture });
  }
  render(){
    const { hits } = this.props
    const listItems = hits.map((hit) =>
      <div className="sk-hits-grid-hit sk-hits-grid__item" data-qa="hit">
          <img data-qa="face" className="sk-hits-grid-hit__face" src={hit._source.file}/>
          <div data-qa="title" className="sk-hits-grid-hit__title">{hit._source.gender}, {hit._source.age}yrs, B:{hit._source.beauty}%, H:{hit._source.happiness}%</div>
      </div>
    );
    return (
      <div className="sk-hits-grid" data-qa="hits">
        <div  className="sk-hits-grid-hit sk-hits-grid__item btn-add btn-shoot"><a href="#" onClick={this.handlePictureClick}><img src="https://faceatlas.co/static/plus.svg" alt="camera"></img></a></div><div className="btn-filter" onClick={ this.handleFilterClick }></div>
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

  takeSnapshot() {
    Webcam.on('uploadProgress', function() {
      document.getElementById('snapshot-infos').innerHTML = "Beautiful. Trying to analyze your face..";
      //document.getElementById('portrait-wrapper').className += "animated shake infinite";
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
          if (text == "2") {
            document.getElementById('snapshot-infos').innerHTML = "Sorry I could not recognize your face. Please try again";
            Webcam.unfreeze()
          } else if (text == "3") {
            document.getElementById('snapshot-infos').innerHTML = "Sorry I had troubles storing your face. Please try again.";
            Webcam.unfreeze()
          } else {
            document.getElementById('snapshot-infos').innerHTML = text;
            document.getElementById('snapshot-infos').className = "";
          }
        } );
    } );
  }

  render() {
    return (
      <div className="snapshot-view" id="snapshot-view">
      <p id="snapshot-infos" ref="snapshot-infos">Photo time! Your beauty, age and happiness will be judged automatically</p>
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

let showTakePicture = false;


export class SearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showFilters: "hideFilters", showInfos: "hideInfos", showTakePicture: false  };
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
    this.handlePictureClick = this.handlePictureClick.bind(this);
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
    alert("yo");
    this.setState({ showTakePicture: !this.state.showTakePicture });

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
              <div className="modal-text"> <p>Face Atlas is a crowdsourced collection of portraits, that were judged by an algorithm. It is an experiment in privacy and computer people knowledge.</p>
<p>Made by <a href="https://twitter.com/m_hertig">m-hertig</a> using AWS, Rekognition, Elasticsearch, Searchkit & React</p>
<p>Many thanks to <a href="https://twitter.com/paweloque">Pawel</a> for his support</p>
  <div className="btn-add"><a href="#" onClick={ this.handleInfoClick } >OK</a></div>
</div>
            </div>
            <SideBar>
          <span className="sidebar-filters">
            <RangeFilter
                id="beauty"
                field="beauty"
                min={0}
                max={100}
                showHistogram={true}
            title="Beauty %"/>
            <RangeFilter
                id="happiness"
                field="happiness"
                min={0}
                max={100}
                showHistogram={true}
                title="Happiness %"/>
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
              <ViewSwitcherHits
                  hitsPerPage={50}
                  hitComponents={[
                      {key:"grid", title:"Grid", listComponent:FacesGrid, defaultOption:true}
                  ]}
                  scrollTo="body" />
		          <NoHits/>
							<Pagination showNumbers={true}/>
		        </LayoutResults>

		      </LayoutBody>
		    </Layout>
		  </SearchkitProvider>
		)
	}
}
