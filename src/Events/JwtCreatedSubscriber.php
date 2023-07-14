<?php
 namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber {
    public function updateJwtData(JWTCreatedEvent $event) {
        //recuperer son utilisateur pour avoir son firstnale et lastname
        $user = $event->getUser();
        //enrichire les data pour qu'elle les données
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
        // dd($event->getData());
    }
}