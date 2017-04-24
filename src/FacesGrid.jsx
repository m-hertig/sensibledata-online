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
    this.setState({ showTakePicture: !this.state.showTakePicture });
          alert(this.state.showTakePicture);
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
