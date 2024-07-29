import { Controller } from '@nestjs/common';
import { ROUTER } from '../../../common/constant/router.constant';
import { ClientService } from '../client.service';

@Controller(ROUTER.CLIENT)
export class ClientController {
    constructor(private readonly clientService: ClientService) {}
}
