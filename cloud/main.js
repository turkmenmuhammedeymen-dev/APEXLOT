'use strict';

/**
 * APEXLOT — Back4App / Parse Cloud Code
 * Upload this file in Back4App Cloud Code only after configuring Parse classes,
 * CLP/ACL rules and production secrets in the dashboard.
 *
 * Never place the Master Key or private credentials in browser files.
 */

const APP_VERSION = '0.1.0';

function requireUser(request) {
  if (!request.user) throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Oturum gerekli.');
  return request.user;
}

Parse.Cloud.define('apexlotHealth', async () => ({
  ok: true,
  app: 'APEXLOT',
  version: APP_VERSION,
  serverTime: new Date().toISOString()
}));

Parse.Cloud.define('apexlotGetProfile', async (request) => {
  const user = requireUser(request);
  const query = new Parse.Query('ApexlotProfile');
  query.equalTo('owner', user);
  query.limit(1);
  const profile = await query.first({ useMasterKey: true });
  if (!profile) {
    const created = new Parse.Object('ApexlotProfile');
    created.set('owner', user);
    created.set('displayName', user.get('username') || 'Driver');
    created.set('level', 1);
    created.set('experience', 0);
    created.set('credits', 0);
    created.setACL(new Parse.ACL(user));
    await created.save(null, { useMasterKey: true });
    return { displayName: created.get('displayName'), level: 1, experience: 0, credits: 0 };
  }
  return {
    displayName: profile.get('displayName') || 'Driver',
    level: profile.get('level') || 1,
    experience: profile.get('experience') || 0,
    credits: profile.get('credits') || 0
  };
});

Parse.Cloud.define('apexlotSaveGarage', async (request) => {
  const user = requireUser(request);
  const ownedVehicleIds = request.params && request.params.ownedVehicleIds;
  if (!Array.isArray(ownedVehicleIds) || ownedVehicleIds.length > 100 ||
      !ownedVehicleIds.every(id => typeof id === 'string' && /^[a-z0-9_-]{1,48}$/i.test(id))) {
    throw new Parse.Error(Parse.Error.INVALID_JSON, 'Araç listesi geçersiz.');
  }
  const query = new Parse.Query('ApexlotGarage');
  query.equalTo('owner', user);
  let garage = await query.first({ useMasterKey: true });
  if (!garage) {
    garage = new Parse.Object('ApexlotGarage');
    garage.set('owner', user);
    garage.setACL(new Parse.ACL(user));
  }
  garage.set('ownedVehicleIds', [...new Set(ownedVehicleIds)]);
  await garage.save(null, { useMasterKey: true });
  return { ok: true, vehicleCount: garage.get('ownedVehicleIds').length };
});

Parse.Cloud.define('apexlotGetGarage', async (request) => {
  const user = requireUser(request);
  const query = new Parse.Query('ApexlotGarage');
  query.equalTo('owner', user);
  const garage = await query.first({ useMasterKey: true });
  return { ownedVehicleIds: garage ? (garage.get('ownedVehicleIds') || []) : [] };
});

// Leaderboards, trading, real-time rooms and voice require dedicated validation,
// anti-cheat and a real-time networking service; they are intentionally not faked here.
