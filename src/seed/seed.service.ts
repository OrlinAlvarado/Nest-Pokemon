import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PokeResponse } from '../seed/interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
    const pokemons = []
    data.results.forEach(async({ name, url}) => {
      const segments = url.split('/');
      const no: number =  +segments[ segments.length - 2 ]

      pokemons.push({ no, name})
    })

    await this.pokemonModel.insertMany(pokemons)

    return 'Seed Executed';
    
  }

  
}
