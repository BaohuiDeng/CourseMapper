import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourselistService {

  constructor(private http: HttpClient) { }
  pageParams: {
    limit: 12,
    sortBy: '_id',
    orderBy: '-1',
    lastPage: false
  };
  filterTags = [];
  categoryId:any;
  courses: null;
  pageUrl = '';
  baseUrl:string = "http://localhost:3000/api";

  init(categoryId, filterTags, success, error, force) {
    var self = this;

    self.filterTags = filterTags;
    self.categoryId = categoryId;
    self.setPageUrl();

    if (!force && self.courses) {
        if (success)
            success(self.courses);
    }

    else if (force || !self.courses) {
        var url = this.baseUrl + '/category/' + self.categoryId + '/courses' + self.pageUrl;

        this.http.get(url).subscribe({
          next:(data:any)=>{
            self.courses = data.courses;
            success(data.courses)
          },
          error:error=>{
            error(error.errors);
          }
        });
    }
  }
  setPageParams(scp) {
    var self = this;
    self.pageParams.limit = scp.limit;
    self.pageParams.sortBy = scp.sortBy;
    self.pageParams.orderBy = scp.orderBy;
    self.pageParams.lastPage = scp.lastPage;
  }
  setPageUrl() {
    this.pageUrl = '?';

    var ps = [];
    for (var k in this.pageParams) {
        ps.push(k + '=' + this.pageParams[k]);
    }

    var t = [];
    if (this.filterTags && this.filterTags.length > 0) {
        for (var i in this.filterTags)
            t.push(this.filterTags[i]._id);

        ps.push('tags=' + t.join(','));
    }

    this.pageUrl += ps.join('&');
  }
}
