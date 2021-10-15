import React, { Component } from 'react';
import axios from 'axios';
import { RouteComponentProps } from 'react-router';
import _ from 'lodash';
import { EmployeeIStates } from './EmployeeInterfaceStates';
import { PaginationInterface } from './pagination/PaginationInterface';
import Pagination from './pagination/Pagination';

class EmployeeList extends Component<RouteComponentProps,EmployeeIStates & PaginationInterface> {

    constructor(props: RouteComponentProps) {
        super(props)
        this.myHandler = this.myHandler.bind(this);
        this.changePage = this.changePage.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.state = {
          datarecords: [],
          datacolumns: [],
          posts: [],
          loading: false,
          currentPage: 1,
          postsPerPage: 10
        };
      }
    
      //Methods
      componentWillMount(): void {const api_url = 'http://localhost:7000/employees/';
        axios.get(api_url).then(response => {
        this.setState({datarecords: response.data});
        this.extractColumnNames();
        });
        document.body.removeEventListener('click', this.myHandler);
        document.body.removeEventListener('click', this.changePage);
      }

      
      private myHandler(id: any) {
        console.log (id);
        window.location.href = 'http://localhost:3000/edit-employee/'+ id;
      }

      private extractColumnNames() {
        const firstrecord = _.keys(this.state.datarecords[0]);
        var location = firstrecord.indexOf("__v");
        delete firstrecord[location];
        this.setState({datacolumns: firstrecord,});
      }

      private displayRecords(key: number, indexOfFirstPost: number){
        key = key + indexOfFirstPost;
        const datacolumns= this.state.datacolumns;
        return datacolumns.map((each_col) =>
        this.displayRecordName(each_col,key))
      }

      private displayRecordName(colname:string, key:number){
        const record = this.state.datarecords[key];
        return <th>{record[colname]}</th>
      }
      private Capitalize(str: string){
        const str_t = str.toUpperCase();
        const str_tt = str_t.replace('_', ' ');
        return str_tt;
      }

      // Change page
      private changePage(pageNumber: any){
        this.setState({currentPage: pageNumber});
        console.log(pageNumber)
      }

    render () {

        // Get current posts
        const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
        const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
        const currentPosts = this.state.datarecords.slice(indexOfFirstPost, indexOfLastPost);

        console.log(currentPosts);
        console.log(indexOfFirstPost);
        const datarecords = currentPosts;
        const each_datarecord_keys = this.state.datacolumns;

        return (
            <div>
                {datarecords.length === 0 && (
                    <div className="text-center">
                        <h2>No datarecords found at the moment</h2>
                    </div>
                )}
                <div className="container" style={{
                width: "100%",
                paddingLeft: "30px",
                paddingTop: "30px",
                paddingBottom: "6px"
                }}>
                    <div className="row">
                        <table className="table table-bordered" id = "tbl" >
                            <thead className="thead-light">
                              <tr>
                                {each_datarecord_keys && each_datarecord_keys.map(each_datarecord_key => 
                                  <th scope="col">{this.Capitalize(each_datarecord_key)}</th>
                                )}
                                {/* <th scope="col">Actions</th> */}
                              </tr>
                            </thead>                            
                            <tbody> 
                              {currentPosts && currentPosts.map((each_datarecord, index) =>
                                <tr className="rowInfo" onClick={()=>this.myHandler(each_datarecord._id)}>

                                  {this.displayRecords(index, indexOfFirstPost)} 

                                  {/* <td>
                                    <Link className="edit-link" to={"/edit-employee/" + each_datarecord._id}>
                                      Edit
                                    </Link>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button onClick={() => this.deleteEmployee(each_datarecord._id)} size="sm" variant="danger">Delete</Button>
                                  </td> */}

                                </tr>
                              )}
                            </tbody>
                            <Pagination
                                postsPerPage={this.state.postsPerPage}
                                totalPosts={this.state.datarecords.length}
                                paginate={this.changePage} 
                            />
                          </table>
                      </div>
                  </div>
              </div>
          )
      }
  }



export default EmployeeList;