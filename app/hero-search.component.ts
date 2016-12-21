import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
	moduleId: module.id,
	selector: 'hero-search',
	templateUrl: 'hero-search.component.html',
	styleUrls: ['hero-search.component.css'],
	providers: [HeroSearchService]
})

export class HeroSearchComponent implements OnInit {
	heroes: Observable<Hero[]>;
	private searchTerms = new Subject<string>();

	constructor(
		private heroSearchService: HeroSearchService,
		private router: Router) {}

	search(term: string): void {
		this.searchTerms.next(term);
	}	

	gotoDetail(hero: Hero): void {
		let link = ['/detail', hero.id];
		this.router.navigate(link);
	}

	ngOnInit() : void {
		this.heroes = this.searchTerms
			.debounceTime(300)						// 300ms pause between events
			.distinctUntilChanged()				// ignore if next search term is same as previous
			.switchMap(term => term				// switch to new observable each time
				// returns the http observable
				? this.heroSearchService.search(term)
				// or the observable of empty heroes if no search terms
				: Observable.of<Hero[]>([]))
			.catch(error => {
				// TODO real error handling
				console.log(error);
				return Observable.of<Hero[]>([]);
			});
	}
}