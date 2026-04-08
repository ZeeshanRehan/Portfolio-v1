class ParkingLot{
    floors :Floor[] = []

    park(vehicle:Vehicle) : Spot | null {
        for(const floor of this.floors){
            const spot = floor.park(vehicle);

            if(spot !== null){
                return spot
            }
        }
        return null
    } 
}

class Floor{
    spots : Spot[] = [];

    park(vehicle: Vehicle): Spot | null{
        for(const spot of this.spots){
            if(spot.park(vehicle)){
                return spot;
            }
        }
        return null;
    }
}

class Spot{
    isAvailable : boolean = true;
    occupiedBy: Vehicle | null = null;

    constructor(public type: VehicleType){}


    park(vehicle: Vehicle):boolean {
        if(!this.isAvailable) return false;

        if(this.type !== vehicle.type) return false;

        this.isAvailable = false
        this.occupiedBy = vehicle;
        return true;
    }

    unpark(){
        this.isAvailable = true
        this.occupiedBy = null
    }

}


class Vehicle{
    constructor (public plate: string, public type: VehicleType){}


}

enum VehicleType{
    CAR,
    BIKE,
    TRUCK
}





