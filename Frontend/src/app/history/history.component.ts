import { Component, OnInit ,Output} from '@angular/core';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  SoldQuery={}
  _history = [];
  links=[]
  displayFlag=false;

  data = [{ id: 0, name: '', type: [] }];
  id: number;
  selectedLearning: String;
  dataString: String;
  lengthNumber = 10;//nombre de données dans la table utilisée
  constructor(private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authenticationService.getQueryHistory().subscribe(
      data => {
        this._history = data['data'];
      },
      error => {
        console.log(error);
      });
  }

  loadQuery(oldQuery): void {
    this.displayFlag=false

    this.SoldQuery=oldQuery
    this.SoldQuery['results']=(this.SoldQuery['results'])


    this.selectedLearning=this.SoldQuery['model']
    console.log(this.selectedLearning)
    for (let i=0;i<JSON.parse(this.SoldQuery['results'])[0].length;i++){
      this.links.push( {'source':parseInt(JSON.parse(this.SoldQuery['results'])[0][i]['source']['name']),'target':parseInt(JSON.parse(this.SoldQuery['results'])[0][i]['target']['name']),'type':'unknown'})
    }
    this.data=JSON.parse(this.SoldQuery['results'])[1]
    this.lengthNumber=JSON.parse(this.SoldQuery['results'])[2]
    this.id=JSON.parse(this.SoldQuery['results'])[3]
    this.dataString=JSON.parse(this.SoldQuery['results'])[4]
    this.displayFlag=true
  }

  deleteQuery(query_id): void {
    this.authenticationService.deleteQueryHistory(query_id).subscribe(
      data => {
        console.log(data.message);
        this.authenticationService.getQueryHistory().subscribe(
          data2 => {
            this._history = data2.data;
          },
          error => {
            console.log(error);
          });
      },
      error => {
        console.log(error);
      });
  }
}
